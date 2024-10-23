// fetchData.js
import axios from 'axios';

export const fetchData = async (url:string, setter:any) => {
    if(!url){
        throw new Error("URL must be provided");
    }
  try {
    const response = await axios.get(url);
    console.log("🚀 ~ fetchData ~ response:", response)
    await setter(response.data.data);
    return { data: response.data, error: null }; // Return data and null error
  } catch (error) {
    return { data: null, error: 'Failed to fetch data' }; // Return null data and error message
  }
};
