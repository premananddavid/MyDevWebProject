load.initialize(async function() {});

load.action("Action", async function() {
    load.log("Hello DevWeb");
    //print parameter value
    load.log(`${load.params.username}`);
    load.log(`${load.params.jobtitle}`);
    //Declare Transaction
    let T00 = new load.Transaction("S01_DevWeb_VSCode_GET_T00");
    T00.start();

    const request1 = new load.WebRequest({
        url: "https://reqres.in/api/users/2",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        resources: [],
        extractors: [
            new load.BoundaryExtractor("name", {
                "leftBoundary": "_name\":\"",
                "rightBoundary": "\"",
                "scope": "body",
                "occurrence": "load.ExtractorOccurrenceType.All"
            }),
            new load.BoundaryExtractor('first_name', 'first_name":"', '","'),
            new load.TextCheckExtractor("isSuccess1", "first_name"),
            new load.JsonPathExtractor("text", "$.ad.text")
        ],
        returnBody: true
    }).sendSync();
    //Error handling using TextCheckExtractor
    if (request1.extractors.isSuccess1) {
        T00.stop(load.TransactionStatus.Passed);
    } else {
        T00.stop(load.TransactionStatus.Failed);
        load.exit("iteration");
    }
    //Print response body
    load.log(request1.body);
    //Print correlation value
    load.log(`${request1.extractors['first_name']}`);
    ////Print correlation value for ordinal occurence second
    load.log(`${request1.extractors.name[1]}`);

    //think time
    load.sleep(3);
    //Dynamic Transaction example
    let T05 = new load.Transaction(`S01_DevWeb_VSCode_POST_T05_${request1.extractors.first_name}`);
    //Transaction Start
    T05.start();

    const request2 = new load.WebRequest({
        url: "https://reqres.in/api/users",
        method: "POST",
        headers: { "Content-Type": "text/html; charset=utf-8" },
        resources: [],
        body: {
            "name": `${request1.extractors['first_name']}`, //replace static value to correlated value
            "job": "Tester"
        },
        returnBody: true,
        handleHTTPError: (webResponse) => {
            if (webResponse.status === 201) {
                return false;
            }
        }
    }).sendSync();
    //Error handling using web response status
    if (request2.status === 201) {
        T05.stop(load.TransactionStatus.Passed);
    } else {
        T05.stop(load.TransactionStatus.Failed);
        load.exit("iteration");
    }
    load.log(request2.body);
    load.sleep(3);
    let T10 = new load.Transaction("S01_DevWeb_VSCode_PUT_T10");
    T10.start();

    const request3 = new load.WebRequest({
        url: "https://reqres.in/api/users/2",
        method: "PUT",
        headers: { "Content-Type": "text/html; charset=utf-8" },
        resources: [],
        body: {
            "name": "Ashish Ashawan",
            "job": "Software Test Eng"
        },
        extractors: [
            new load.RegexpExtractor("status", "\"(.*?)At\":\".*Z\"")
        ],
        returnBody: true
    }).sendSync();

    T10.stop();
    load.log(request3.body);
    //Print Regex Extractor value
    load.log(`Status: ${request3.extractors.status}`);
});

load.finalize(async function() {});