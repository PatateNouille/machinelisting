// --- Global init
var logElem = document.getElementById('log');
var catalogElem = document.getElementById('catalog');



// --- Test
getGithubJSON('PatateNouille', 'machinelisting', 'resources.json', populateResources, 'Could not load the resource data :(');



// --- Utility
function populateResources(data)
{
    data.forEach(resource =>
    {
        catalogElem.appendChild(createResourceElement(resource));
    });
}

function createResourceElement(data)
{
    const resElem = document.createElement('div');
    const nameElem = resElem.appendChild(document.createElement('a'));
    const descQuickElem = resElem.appendChild(document.createElement('p'));
    const pricingOptionsElem = resElem.appendChild(document.createElement('div'));
    const descElem = resElem.appendChild(document.createElement('p'));
    const featuresElem = resElem.appendChild(document.createElement('div'));
    
    resElem.classList.add('resource');
    nameElem.classList.add('name');
    descQuickElem.classList.add('desc-quick');
    pricingOptionsElem.classList.add('pricing-options');
    descElem.classList.add('desc');
    featuresElem.classList.add('features');

    if (data.infoChecked !== true)
        resElem.classList.add('need-check');

    nameElem.href = data.url;
    nameElem.innerText = data.name;
    descQuickElem.innerText = data.descQuick;
    descElem.innerText = data.desc;

    data.pricingOptions.forEach(pricing => 
    {
        const pricingElem = pricingOptionsElem.appendChild(document.createElement('p'));

        pricingElem.classList.add('pricing');
        if ('type' in pricing)
            pricingElem.classList.add(pricing.type);

            pricingElem.innerText = pricing.label;
    });

    data.features.forEach(feature =>
    {
        const featureElem = featuresElem.appendChild(document.createElement('div'))

        featureElem.classList.add('feature', feature.type);

        switch (feature.type)
        {
            default:
            case 'convert':
                featureElem.appendChild(createResourceTypeElement(feature.from))
                featureElem.appendChild(document.createTextNode(' to '))
                featureElem.appendChild(createResourceTypeElement(feature.to))
                break;
        }
    });

    return resElem;
}

function createResourceTypeElement(type)
{
    const typeElem = document.createElement('p')

    typeElem.classList.add('type');
    typeElem.innerText = type;

    return typeElem;
}



// --- Utility
function getGithubJSON(owner, repo, relativePath, callback, errorMessage, errorCallback = logOnPage)
{
    getJSON('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+relativePath, getBlob, "Could not get file information", onFail);

    function getBlob(data)
    {
        getJSON(data.git_url, decodeBlob, 'Could not get blob data', onFail);
    }

    function decodeBlob(data)
    {
        try
        {
            callback(JSON.parse(atob(data.content)));
        }
        catch (error)
        {
            errorCallback(400, errorMessage, error);
        }
    }

    function onFail(status, message, data)
    {
        errorCallback(status, errorMessage + ': ' + message, data);
    }
}

function getJSON(url, callback, errorMessage, errorCallback = logOnPage)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState !== XMLHttpRequest.DONE)
            return;

        var status = xhr.status;
        if (status === 200)
            callback(xhr.response);
        else
            errorCallback(status, errorMessage, xhr.response);
    };
    
    try
    {
        xhr.send();
    }
    catch (error)
    {
        errorCallback(403, "An unexpected error occured", error);
    }
};

function logOnPage(status, message, data)
{
    const entryElem = document.createElement('div');
    const statusElem = entryElem.appendChild(document.createElement('p'));
    const msgElem = entryElem.appendChild(document.createElement('p'));
    const dataElem = entryElem.appendChild(document.createElement('code'));

    entryElem.classList.add('log-entry');
    {
        if (status < 100 || status >= 600)
            entryElem.classList.add('log-unknown');
        else if (status < 200) // 100 - 199
            entryElem.classList.add('log-info');
        else if (status < 300) // 200 - 299
            entryElem.classList.add('log-success');
        else if (status < 400) // 300 - 399
            entryElem.classList.add('log-redirect');
        else if (status < 500) // 400 - 499
            entryElem.classList.add('log-client');
        else // 500 - 599
            entryElem.classList.add('log-server');
    }
    
    statusElem.classList.add('log-status');
    statusElem.innerText = status;

    msgElem.classList.add('log-message');
    msgElem.innerText = message;
    
    dataElem.classList.add('log-data');
    dataElem.innerText = JSON.stringify(data);

    logElem.appendChild(entryElem);
    logElem.classList.remove('empty')
}