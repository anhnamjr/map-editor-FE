var mymap;
var lyrOSM;
var lyrWatercolor;
var lyrTopo;
var lyrImagery;
var lyrOutdoors;
var lyrEagleNests;
var lyrRaptorNests;
var lyrClientLines;
var lyrClientLinesBuffer;
var lyrBUOWL;
var lyrBUOWLbuffer;
var jsnBUOWLbuffer;
var lyrGBH;
var lyrSearch;
var lyrMarkerCluster;
var mrkCurrentLocation;
var fgpDrawnItems;
var ctlAttribute;
var ctlScale;
var ctlMouseposition;
var ctlMeasure;
var ctlEasybutton;
var ctlSidebar;
var ctlLayers;
var ctlStyle;
var ctlLegend;
var objBasemaps;
var objOverlays;
var arProjectIDs = [];
var arHabitatIDs = [];
var arEagleIDs = [];
var arRaptorIDs = [];
$(document).ready(function () {
  //- console.log($('#divFilterTRAVEL div input').filter((index, item) => item.checked))

  //  ********* Map Initialization ****************
  mymap = L.map("mapdiv", {
    center: [40.18, -104.83],
    zoom: 14,
    attributionControl: false,
    zoomControl: false,
  });
  ctlSidebar = L.control.sidebar("sidebar").addTo(mymap);
  ctlAttribute = L.control
    .attribution({ position: "bottomright" })
    .addTo(mymap);
  ctlAttribute.addAttribution("OSM");
  ctlAttribute.addAttribution(
    '&copy; <a href="http://millermountain.com">Miller Mountain LLC</a>'
  );
  ctlScale = L.control
    .scale({ position: "bottomright", metric: false, maxWidth: 200 })
    .addTo(mymap);
  ctlMouseposition = L.control
    .mousePosition({ position: "bottomright" })
    .addTo(mymap);
  //   *********** Layer Initialization **********
  lyrOSM = L.tileLayer.provider("OpenStreetMap.Mapnik");
  lyrTopo = L.tileLayer.provider("OpenTopoMap");
  lyrImagery = L.tileLayer.provider("Esri.WorldImagery");
  lyrOutdoors = L.tileLayer.provider("Thunderforest.Outdoors");
  lyrWatercolor = L.tileLayer.provider("Stamen.Watercolor");
  mymap.addLayer(lyrOSM);

  // ********* Setup Layer Control  ***************
  objBasemaps = {
    "Open Street Maps": lyrOSM,
    "Topo Map": lyrTopo,
    Imagery: lyrImagery,
    Outdoors: lyrOutdoors,
    Watercolor: lyrWatercolor,
  };
  objOverlays = {};
  ctlLayers = L.control.layers(objBasemaps, objOverlays).addTo(mymap);
  mymap.on("overlayadd", function (e) {
    var strDiv = "#lgnd" + stripSpaces(e.name);
    $(strDiv).show();
    if (e.name == "Linear Projects") {
      lyrClientLinesBuffer.addTo(mymap);
      lyrClientLines.bringToFront();
    }
    if (e.name == "Burrowing Owl Habitat") {
      lyrBUOWLbuffer.addTo(mymap);
      lyrBUOWL.bringToFront();
    }
  });
  mymap.on("overlayremove", function (e) {
    var strDiv = "#lgnd" + stripSpaces(e.name);
    $(strDiv).hide();
    if (e.name == "Linear Projects") {
      lyrClientLinesBuffer.remove();
    }
    if (e.name == "Burrowing Owl Habitat") {
      lyrBUOWLbuffer.remove();
    }
  });
  $(".legend-container").append($("#legend"));
  $(".legend-toggle").append(
    $(
      "<i class='legend-toggle-icon fa fa-server fa-2x' style='color:#000'></i>"
    )
  );
  ctlZoom = L.control.zoom({ position: "topright" }).addTo(mymap);
  // define drawtoolbar options
  var options = {
    position: "topright", // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
    drawMarker: true, // adds button to draw markers
    drawPolyline: true, // adds button to draw a polyline
    drawRectangle: false, // adds button to draw a rectangle
    drawPolygon: true, // adds button to draw a polygon
    drawCircle: false, // adds button to draw a cricle
    cutPolygon: false, // adds button to cut a hole in a polygon
    editMode: false, // adds button to toggle edit mode for all layers
    removalMode: false, // adds a button to remove layers
  };
  // add leaflet.pm controls to the map
  mymap.pm.addControls(options);
  // listen to when a new layer is created
  mymap.on("pm:create", function (e) {
    var jsn = e.layer.toGeoJSON().geometry;
    if (isShowing("btnBUOWLinsert") && e.shape == "Poly") {
      jsn = {
        type: "MultiPolygon",
        coordinates: [jsn.coordinates],
      };
      $("#buowl_geojson").val(JSON.stringify(jsn));
    } else {
      // var jsn=e.layer.toGeoJSON().geometry;
      $.ajax({
        url: "http://localhost:3000/affected_constraints",
        data: { id: "geojson", geojson: JSON.stringify(jsn) },
        type: "POST",
        success: function (response) {
          $("#tableData").html(response);
          $("#dlgModal").show();
        },
        error: function (xhr, status, error) {
          $("#tableData").html("ERROR: " + error);
          $("#dlgModal").show();
        },
      });
    }
  });
  ctlMeasure = L.control.polylineMeasure({ position: "topright" }).addTo(mymap);
  // ************ Location Events **************
  mymap.on("locationfound", function (e) {
    console.log(e);
    if (mrkCurrentLocation) {
      mrkCurrentLocation.remove();
    }
    mrkCurrentLocation = L.circle(e.latlng, {
      radius: e.accuracy / 2,
    }).addTo(mymap);
    mymap.setView(e.latlng, 14);
  });
  mymap.on("locationerror", function (e) {
    console.log(e);
    alert("Location was not found");
  });
  changeOptions("buowl_habitat", "dj_buowl", "habitat");
  changeOptions("buowl_hist_occup", "dj_buowl", "hist_occup");
  changeOptions("buowl_recentstatus", "dj_buowl", "recentstatus");
});

//              ******  Load Data  ******
//- refreshEagles();
//- refreshRaptors();
//- refreshLinears();
//- refreshBUOWL();
//- refreshGBH();

const chooseBoard = () => {
  let inputs = document.querySelectorAll("#divFilterTRAVEL div input");
  let result = [];
  inputs.forEach((item) => {
    if (item.checked) {
      result.push(item.value);
    }
  });
  console.log(result);
  return result;
};

//- const boardName = {
//-   "eagle": LyrEagleNests,
//-   "buowl": lyrBUOWL,
//- }

const loadData = (result) => {
  if (result.indexOf("eagle") !== -1) {
    refreshEagles();
  } else {
    if (lyrEagleNests) {
      ctlLayers.removeLayer(lyrEagleNests);
      lyrEagleNests.remove();
    }
  }
  if (result.indexOf("buowl") !== -1) {
    refreshBUOWL();
  } else {
    if (lyrBUOWL) {
      ctlLayers.removeLayer(lyrBUOWL);
      lyrBUOWL.remove();
      lyrBUOWLbuffer.remove();
    }
  }
};
loadData(chooseBoard());
$("#divFilterTRAVEL div input").change(() => loadData(chooseBoard()));

//  ********* BUOWL Functions
$("#btnBUOWL").click(function () {
  $("#lgndBUOWLDetail").toggle();
});
$("#txtFindBUOWL").on("keyup paste", function () {
  var val = $("#txtFindBUOWL").val();
  testLayerAttribute(
    arHabitatIDs,
    val,
    "Habitat ID",
    "#divFindBUOWL",
    "#divBUOWLError",
    "#btnFindBUOWL"
  );
});
function findBUOWL(val) {
  returnLayerByAttribute("dj_buowl", "habitat_id", val, function (lyr) {
    if (lyr) {
      if (lyrSearch) {
        lyrSearch.remove();
      }
      lyrSearch = L.geoJSON(lyr.toGeoJSON(), {
        style: { color: "red", weight: 10, opacity: 0.5, fillOpacity: 0 },
      }).addTo(mymap);
      mymap.fitBounds(lyr.getBounds().pad(1));
      var att = lyr.feature.properties;
      $("#buowl_id").val(att.id);
      $("#buowl_habitat").val(att.habitat);
      $("#buowl_hist_occup").val(att.hist_occup);
      $("#buowl_recentstatus").val(att.recentstatus);
      $("#buowl_lastsurvey").val(att.lastsurvey);
      $("#buowl_geojson").val(JSON.stringify(lyr.feature.geometry));
      $("#BUOWLmetadata").html(
        "Created " +
          att.created +
          " by " +
          att.createdby +
          "<br>Modified " +
          att.modified +
          " by " +
          att.modifiedby
      );
      $("#formBUOWL").show();
      $("#btnEditBUOWLgeometry").hide();
      $.ajax({
        url: "http://localhost:3000/find",
        data: {
          tbl: "dj_buowl",
          distance: 300,
          fld: "habitat_id",
          id: val,
        },
        type: "POST",
        success: function (response) {
          $("#divBUOWLaffected").html(response);
        },
        error: function (xhr, status, error) {
          $("#divBUOWLaffected").html("ERROR: " + error);
        },
      });
      $("#divBUOWLError").html("");
      // $("#btnBUOWLsurveys").show();
    } else {
      $("#divBUOWLError").html("**** Habitat ID not found ****");
    }
  });
}
$("#btnFindBUOWL").click(function () {
  findBUOWL($("#txtFindBUOWL").val());
});
$("#lblBUOWL").click(function () {
  $("#divBUOWLData").toggle();
});
$("input[name=fltBUOWL]").click(function () {
  var optFilter = $("input[name=fltBUOWL]:checked").val();
  if (optFilter == "ALL") {
    refreshBUOWL();
  } else {
    refreshBUOWL("hist_occup='" + optFilter + "'");
  }
});
$("#btnRefreshBUOWL").click(function () {
  alert("Refreshing BUOWL");
  refreshBUOWL();
});
//          BUOWL editing event eventhandlers
$("#btnEditBUOWL").click(function () {
  $(".inpBUOWL").attr("disabled", false);
  $("#btnEditBUOWLgeometry").show();
  $("#buowl_id").attr("disabled", true);
  $("#buowl_geojson").attr("disabled", true);
  $("#btnBUOWLupdate").show();
});
$("#btnEditBUOWLgeometry").click(function () {
  if (isShowing("btnBUOWLupdate")) {
    var jsnMulti = JSON.parse($("#buowl_geojson").val());
    var jsnSingle = {
      type: "Polygon",
      coordinates: jsnMulti.coordinates[0],
    };
    var lyrEdit = L.geoJSON(jsnSingle).addTo(mymap);
    lyrEdit.pm.enable();
    mymap.on("contextmenu", function () {
      if (
        confirm(
          "Are you sure you want to update the geometry for this feature?"
        )
      ) {
        var jsnEdited = lyrEdit.toGeoJSON();
        jsnEdited = jsnEdited.features[0].geometry;
        jsnEdited = {
          type: "MultiPolygon",
          coordinates: [jsnEdited.coordinates],
        };
        alert(JSON.stringify(jsnEdited));
        $("#buowl_geojson").val(JSON.stringify(jsnEdited));
        lyrEdit.pm.disable();
        lyrEdit.remove();
        mymap.off("contextmenu");
      }
    });
  } else if (isShowing("btnBUOWLinsert")) {
    mymap.pm.enableDraw("Poly", { finishOn: "contextmenu" });
  } else {
    alert("Editing not enabled~");
  }
});
// $("btnBUOWLUpdate").click(function(){
//     var jsn = returnFormData('inpBUOWL');
//     alert(`Updating dj_buowl record ${jsn.id} with ${JSON.stringify(jsn)}`)
// })
$("#btnBUOWLupdate").click(function () {
  var jsn = returnFormData("inpBUOWL");
  jsn.tbl = "dj_buowl";
  alert(
    "Updating dj_buowl record " + jsn.id + " with\\n\n" + JSON.stringify(jsn)
  );
  updateRecord(jsn);
});
$("#btnDeleteBUOWL").click(function () {
  var id = $("#buowl_id").val();
  if (confirm("Are you sure you want to delete BUOWL " + id + "?")) {
    deleteRecord("dj_buowl", id);
    $("#divBUOWLData").hide();
    $("#divBUOWLAffect").html("");
    $("#txtfindBUOWL").val("");
  }
});
function deleteRecord(tbl, id) {
  $.ajax({
    url: "http://localhost:3000/delete",
    data: { tbl, id },
    type: "POST",
    success: function (res) {
      if (JSON.stringify(res).substr(0, 5) === "ERROR") {
        alert(res);
      } else {
        alert(`Record ${id} deleted from ${tbl}`);
        switch (tbl) {
          case "dj_buowl":
            refreshBUOWL();
            break;
          // case "dj_"
        }
      }
    },
    error: function (xhr, status, error) {
      alert("AJAX ERROR: " + error);
    },
  });
}
function updateRecord(jsn) {
  $.ajax({
    url: "http://localhost:3000/update",
    data: jsn,
    type: "POST",
    success: function (res) {
      if (JSON.stringify(res).substr(0, 5) === "ERROR") {
        alert(res);
      } else {
        alert(`Record ${jsn.id} updated from ${jsn.tbl}`);
        switch (jsn.tbl) {
          case "dj_buowl":
            refreshBUOWL();
            break;
          // case "dj_"
        }
      }
    },
    error: function (xhr, status, error) {
      alert("AJAX ERROR: " + error);
    },
  });
}
function insertRecord(jsn) {
  $.ajax({
    url: "http://localhost:3000/add",
    data: jsn,
    type: "POST",
    success: function (res) {
      if (JSON.stringify(res).substr(0, 5) === "ERROR") {
        alert(res);
      } else {
        alert(`Inserted to ${jsn.tbl} successfully`);
        switch (jsn.tbl) {
          case "dj_buowl":
            refreshBUOWL();
            break;
          // case "dj_"
        }
      }
    },
    error: function (xhr, status, error) {
      alert("AJAX ERROR: " + error);
    },
  });
}
$("#btnAddBUOWL").click(function () {
  // alert("Add BUOWL");
  $("#buowl_id").val("New");
  $("#txtFindBUOWL").val("New");
  $("#buowl_habitat").val("");
  $("#buowl_hist_occup").val("");
  $("#buowl_recentstatus").val("");
  $("#buowl_lastsurvey").val(returnCurrentDate());
  $("#buowl_geojson").val("");
  $("#BUOWLmetadata").html("");
  $(".inpBUOWL").attr("disabled", false);
  $("#buowl_id").attr("disabled", true);
  $("#buowl_geojson").attr("disabled", false);
  $("#BUOWLgeojson").show();
  $("#btnEditBUOWL").hide();
  $("#btnBUOWLupdate").hide();
  $("#btnDeleteBUOWL").hide();
  $("#divBUOWLaffected").hide();
  $("#btnBUOWLinsert").show();
  $("#btnEditBUOWLgeometry").show();
  $("#formBUOWL").show();
});
$("#btnBUOWLinsert").click(function () {
  if ($("#buowl_geojson").val() == "") {
    alert("No geometry has been added!");
  } else if (
    $("#buowl_habitat").val() == "" ||
    $("#buowl_hist_occup").val() == "" ||
    $("#buowl_recentstatus").val() == ""
  ) {
    alert("Please fill out all fields!");
  } else {
    var jsn = returnFormData("inpBUOWL");
    jsn.tbl = "dj_buowl";
    delete jsn.id;
    alert("Adding");
    console.log(jsn);
    insertRecord(jsn);
  }
});
// ************ Client Linears **********
$("#btnLinearProjects").click(function () {
  $("#lgndLinearProjectsDetail").toggle();
});
$("#txtFindProject").on("keyup paste", function () {
  var val = $("#txtFindProject").val();
  testLayerAttribute(
    arProjectIDs,
    val,
    "PROJECT ID",
    "#divFindProject",
    "#divProjectError",
    "#btnFindProject"
  );
});
$("#btnFindProject").click(function () {
  findProject($("#txtFindProject").val());
});
$("#lblProject").click(function () {
  $("#divProjectData").toggle();
});
$("#btnProjectFilterAll").click(function () {
  $("input[name=fltProject]").prop("checked", true);
});
$("#btnProjectFilterNone").click(function () {
  $("input[name=fltProject]").prop("checked", false);
});
$("#btnRefreshLinears").click(function () {
  refreshLinears();
});
$("#btnProjectFilter").click(function () {
  var arTypes = [];
  var cntChecks = 0;
  $("input[name=fltProject]").each(function () {
    if (this.checked) {
      if (this.value == "Pipeline") {
        arTypes.push("'Pipeline'");
        cntChecks++;
      }
      if (this.value == "Flowline") {
        arTypes.push("'Flowline'");
        arTypes.push("'Flowline, est.'");
        cntChecks++;
      }
      if (this.value == "Electric") {
        arTypes.push("'Electric Line'");
        cntChecks++;
      }
      if (this.value == "Road") {
        arTypes.push("'Access Road - Confirmed'");
        arTypes.push("'Access Road - Estimated'");
        cntChecks++;
      }
      if (this.value == "Extraction") {
        arTypes.push("'Extraction'");
        arTypes.push("'Delayed-Extraction'");
        cntChecks++;
      }
      if (this.value == "Other") {
        arTypes.push("'Other'");
        arTypes.push("'Underground Pipe'");
        cntChecks++;
      }
    }
  });
  if (cntChecks == 0) {
    refreshLinears("1=2");
  } else if (cntChecks == 6) {
    refreshLinears();
  } else {
    refreshLinears("type IN (" + arTypes.toString() + ")");
  }
});
// *********  Eagle Functions *****************
$("#btnEagle").click(function () {
  $("#lgndEagleDetail").toggle();
});
$("#txtFindEagle").on("keyup paste", function () {
  var val = $("#txtFindEagle").val();
  testLayerAttribute(
    arEagleIDs,
    val,
    "Eagle Nest ID",
    "#divFindEagle",
    "#divEagleError",
    "#btnFindEagle"
  );
});
$("#btnFindEagle").click(function () {
  findEagle($("#txtFindEagle").val());
});
$("#lblEagle").click(function () {
  $("#divEagleData").toggle();
});
$("input[name=fltEagle]").click(function () {
  var optFilter = $("input[name=fltEagle]:checked").val();
  if (optFilter == "ALL") {
    refreshEagles();
  } else {
    refreshEagles("status='" + optFilter + "'");
  }
});
$("#btnRefreshEagles").click(function () {
  alert("Refreshing Eagles");
  refreshEagles();
});
//  *********** Raptor Functions
$("#btnRaptor").click(function () {
  $("#lgndRaptorDetail").toggle();
});
$("#txtFindRaptor").on("keyup paste", function () {
  var val = $("#txtFindRaptor").val();
  testLayerAttribute(
    arRaptorIDs,
    val,
    "Raptor Nest ID",
    "#divFindRaptor",
    "#divRaptorError",
    "#btnFindRaptor"
  );
});
$("#btnFindRaptor").click(function () {
  findRaptor($("#txtFindRaptor").val());
});
$("#lblRaptor").click(function () {
  $("#divRaptorData").toggle();
});
$("input[name=fltRaptor]").click(function () {
  var optFilter = $("input[name=fltRaptor]:checked").val();
  if (optFilter == "ALL") {
    refreshRaptors();
  } else {
    refreshRaptors("recentstatus='" + optFilter + "'");
  }
});
$("#btnRefreshRaptors").click(function () {
  alert("Refreshing Raptors");
  refreshRaptors();
});
//  *********  jQuery Event Handlers  ************
$("#btnGBH").click(function () {
  $("#lgndGBHDetail").toggle();
});
$("#btnLocate").click(function () {
  mymap.locate();
});
$("#btnZoomToDJ").click(function () {
  mymap.setView([40.18, -104.83], 11);
});
$("#btnTransparent").click(function () {
  if ($("#btnTransparent").html() == "Fill Polygons") {
    lyrRaptorNests.setStyle({ fillOpacity: 0.5 });
    lyrEagleNests.setStyle({ fillOpacity: 0.5 });
    lyrBUOWL.setStyle({ fillOpacity: 0.5 });
    lyrGBH.setStyle({ fillOpacity: 0.5 });
    $("#btnTransparent").html("Make Poygons Transparent");
  } else {
    lyrRaptorNests.setStyle({ fillOpacity: 0 });
    lyrEagleNests.setStyle({ fillOpacity: 0 });
    lyrBUOWL.setStyle({ fillOpacity: 0 });
    lyrGBH.setStyle({ fillOpacity: 0 });
    $("#btnTransparent").html("Fill Polygons");
  }
});
$("#btnRaptorSurveys").click(function () {
  changeOptions("dj_raptor_survey");
  displaySurveys("dj_raptor_survey", $("#txtFindRaptor").val());
});
$("#btnBUOWLsurveys").click(function () {
  changeOptions("dj_buowl_survey");
  displaySurveys("dj_buowl_survey", $("#txtFindBUOWL").val());
});
$("#btnEagleSurveys").click(function () {
  changeOptions("dj_eagle_survey");
  displaySurveys("dj_eagle_survey", $("#txtFindEagle").val());
});
$("#btnCloseModal").click(function () {
  $("#dlgModal").hide();
});
