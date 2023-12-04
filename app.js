// --- Global init
var logElem = document.getElementById("log");



// --- Test
getJSON("https://patatenouille.github.io/machinelisting.github.io/resources.json", (data) => logOnPage(200, "Success !", data), "Could not load the resource data :(");



// --- Utility
function getJSON(url, callback, errorMessage, errorCallback = logOnPage)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function()
    {
        var status = xhr.status;
        if (status === 200)
            callback(xhr.response);
        else
            errorCallback(status, errorMessage, xhr.response);
    };
    
    xhr.send();
};

function logOnPage(status, message, data)
{
    const entryElem = document.createElement("div");
    const statusElem = entryElem.appendChild(document.createElement("p"));
    const msgElem = entryElem.appendChild(document.createElement("p"));
    const dataElem = entryElem.appendChild(document.createElement("code"));

    entryElem.classList.add("log-entry");
    {
        if (status < 100 || status >= 600)
            entryElem.classList.add("log-unknown");
        else if (status < 200) // 100 - 199
            entryElem.classList.add("log-info");
        else if (status < 300) // 200 - 299
            entryElem.classList.add("log-success");
        else if (status < 400) // 300 - 399
            entryElem.classList.add("log-redirect");
        else if (status < 500) // 400 - 499
            entryElem.classList.add("log-client");
        else // 500 - 599
            entryElem.classList.add("log-server");
    }
    
    statusElem.classList.add("log-status");
    statusElem.innerText = status;

    msgElem.classList.add("log-message");
    msgElem.innerText = message;
    
    dataElem.classList.add("log-data");
    dataElem.innerText = JSON.stringify(data);

    logElem.appendChild(entryElem);
    logElem.classList.remove("empty")
}