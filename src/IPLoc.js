import axios from 'axios';

const IPLoc = async (ip) => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", process.env.REACT_APP_APILAYER_KEY);

    try {
        const response = await axios({
            url: `https://api.apilayer.com/ip_to_location/${ip}`,
            method: "get",
            headers: {
                    "apikey": process.env.REACT_APP_APILAYER_KEY
                }
            });
        return response.data;
    } catch (error) {
        console.log(error);
        return {
            isError: true,
            error: error.message
        };
    }

}

export default IPLoc;