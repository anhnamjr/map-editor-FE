import React, { useState } from "react";
import { Input, AutoComplete } from 'antd'
import { useDispatch } from "react-redux"
import { BASE_URL } from "../../../../constants/endpoint"
import { searchGeom } from "../../../../actions/searchGeom"
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
const { Search } = Input;

const SearchForm = () => {
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch()

  const searchResult = (data) =>
    data.map((item, index) => {
      return {
        value: item.geoName,
        id: item.geoID,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            key={index}
          >
            <span>
              {item.geoName}
            </span>
          </div>
        ),
      };
    });


  const searchStyle = {
    marginTop: 6,
  }


  const onSearch = async (searchText) => {
    // const { data } = await setTimeout(() => axios.get(`${BASE_URL}/search?input=${searchText}`), 500)
    if (searchText) {
      const { data } = await AXIOS_INSTANCE.get(`${BASE_URL}/search?input=${searchText}`)
      setOptions(searchResult(data))
    } else {
      setOptions([])
    }
  }

  const handleSelect = (value, options) => {
    dispatch(searchGeom(options.id))
  }

  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      onSearch={onSearch}
      options={options}
      onSelect={handleSelect}
    >
      <Search
        size="large"
        placeholder="Enter the name"
        enterButton
        allowClear
        style={searchStyle} />

    </AutoComplete>


  );
};

export default SearchForm;
