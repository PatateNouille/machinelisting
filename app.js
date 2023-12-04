// --- Global init
var logElem = document.getElementById('log');
var catalogElem = document.getElementById('catalog');



// --- Test
getJSON('https://patatenouille.github.io/machinelisting.github.io/resources.json', populateResources, 'Could not load the resource data :(');



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
    const nameElem = resElem.appendChild(document.createElement('h3'));
    const descQuickElem = resElem.appendChild(document.createElement('p'));
    const pricingOptionsElem = resElem.appendChild(document.createElement('div'));
    const detailsElem = resElem.appendChild(document.createElement('div'));

    const descElem = detailsElem.appendChild(document.createElement('p'));
    const featuresElem = detailsElem.appendChild(document.createElement('div'));
    
    resElem.classList.add('resource');
    nameElem.classList.add('name');
    descQuickElem.classList.add('desc-quick');
    pricingOptionsElem.classList.add('pricing-options');
    detailsElem.classList.add('details');
    descElem.classList.add('desc');
    featuresElem.classList.add('features');

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

        featureElem.classList.add('feature');

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