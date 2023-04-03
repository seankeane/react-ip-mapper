const IPLoc = async (ip) => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", process.env.REACT_APP_APILAYER_KEY);

    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    const response = await fetch(`https://api.apilayer.com/ip_to_location/${ip}`, requestOptions);

    return response.json();
}

export default IPLoc;