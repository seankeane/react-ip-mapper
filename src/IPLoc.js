const IPLoc = async (ip) => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", process.env.REACT_APP_APILAYER_KEY);

    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    try {
        const response = await fetch(`https://api.apilayer.com/ip_to_location/${ip}`, requestOptions);
        if (!response.ok) {
            throw new Error("Bad response from server:" + response);
        }
        return response.json();
    } catch (error) {
        console.error(`There was a problem fetching location data for ${ip}:`, error);
    }
}

export default IPLoc;