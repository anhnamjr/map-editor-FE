import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { CHANGE_MAP_CENTER, CLEAR_SEARCH } from "../../../../constants/actions";
import "./style.scss";
import { Tooltip } from "antd"
import { CloseCircleFilled } from "@ant-design/icons"

const SearchForm = () => {
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log(latLng)
        dispatch({
          type: CHANGE_MAP_CENTER,
          payload: { coor: Object.values(latLng), showMarker: true },
        });
      })
      .catch((error) => console.error("Error", error));
  };

  const handleClearAddress = () => {
    setAddress("")
    dispatch({ type: CLEAR_SEARCH });
  }

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="search">
          <div style={{ position: "relative" }}>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <Tooltip title="Clear">
              <div className="delete-btn" onClick={handleClearAddress}><CloseCircleFilled /></div>
            </Tooltip>
          </div>
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, index) => {
              const className = suggestion.active
                ? "suggestion-item active"
                : "suggestion-item";
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                  })}
                  key={index}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default SearchForm;
