// Type definitions for [DevuWeb SDK] [2020.0.0]
// Project: [DevWeb]
// Definitions by: [DevWeb Team]

declare namespace load {
    import FileEntry = load.MultipartBody.FileEntry;
    import StringEntry = load.MultipartBody.StringEntry;

    export interface OnMessageOptions {
        /**
         *  A unique number indicating the connection number
         */
        id: string;
        /**
         * The received message
         */
        data: string;
        /**
         * The size (in bytes) of the received message
         */
        size: number;
        /**
         * Indicates whether the received message is binary
         */
        isBinary: boolean;
    }

    export interface OnOpenOptions {
        /**
         * A unique number indicating the connection number
         */
        id: string;
        /**
         * The status code of the response
         */
        status: number;
        /**
         *  A key value store of the headers in the response sent by the server
         */
        headers: object;
    }

    export interface OnCloseOptions {
        /**
         * A unique number indicating the connection number
         */
        id: string;
        /**
         * The connection close status code
         */
        code: number;
        /**
         * The connection close reason
         */
        reason: string;
        /**
         * Indicates whether the connection was closed by client
         */
        isClosedByClient: boolean;
    }

    export interface WebSocketConstructorOptions {
        /**
         * The WebSocket endpoint in ws:// or wss:// (secure WebSocket schema) format.
         */
        url: string,
        /**
         * A key value store that maps the header name to its value.
         */
        headers: Object,

        /**
         * A callback function for the "onMessage" event
         */
        onMessage(msg: OnMessageOptions): void,

        /**
         * A callback function for the "onError" event
         */
        onError?(msg: string): void,

        /**
         * A callback function for the "onOpen" event
         */
        onOpen?(msg: OnOpenOptions): void,

        /**
         * A callback function for the "onClose" event
         */
        onClose?(msg: OnCloseOptions): void
    }

    /**
     *  An object that allows to create websocket connection to the AUT. When creating a _WebSocket_ you
     need to pass an options object with mandatory and some optional configuration. Once set, you can
     send and receive messages over the socket.
     *
     * @export
     * @class WebSocket
     */
    export class WebSocket {
        readonly id: string;
        readonly url: string;

        /**
         * Creates a new WebSocket instance.
         * The mandatory _options_ argument must include at least the "url" and the "onMessage" properties, all the other properties are optional.
         */
        constructor(options: WebSocketConstructorOptions);

        /**
         * A callback function for the "onMessage" event
         */
        onMessage(msg: OnMessageOptions): void;

        /**
         * A callback function for the "onError" event
         */
        onError(error: string): void;

        /**
         * A callback function for the "onOpen" event
         */
        onOpen(msg: OnOpenOptions): void;

        /**
         * A callback function for the "onClose" event
         */
        onClose(msg: OnCloseOptions): void;

        /**
         *Opens the WebSocket connection to the remote host. After calling this function it is possible to send and receive messages
         *
         * @memberof WebSocket
         */
        open(): void;

        /**
         * Closes the connection to the server.
         * If the optional _code_ and _reason_ arguments are provided, then the connection is closed with given code and reason.
         *
         * @memberof WebSocket
         */
        close(code?: number, reason?: string): void;

        /**
         * Sends the _data_ to the connected server.
         * In order to send a binary message, _isMessageBinary_ should be set to _true_ otherwise a string message is sent.
         *
         * @param {*} data - The data to send. Can be either a string or a binary array buffer.
         * @param {boolean} isMessageBinary - The default is false, must be set to true when _data_ is binary
         * @memberof WebSocket
         */
        send(data: string | ArrayBuffer, isMessageBinary?: boolean): void;

        /**
         * Returns a Promise that is resolved only when _continue_ is called on the WebSocket or when the _timeout_ has expired.
         * The _timeout_ is given in milliseconds (**Default:** 120000 milliseconds) use -1 for unlimited.
         * This function can be used to asynchronously wait until some other event happens in the system.
         * If the timeout expires before _continue_ has been called, the returned promise is rejected.
         * **Note:** Only one simultaneous call to _waitForData_ is allowed for each WebSocket.
         *
         * @param {number} timeout The timeout in milliseconds. Default: 120000 milliseconds use -1 for unlimited.
         * @returns {Promise}
         * @memberof WebSocket
         */
        waitForData(timeout?: number): Promise<undefined>;

        /**
         * Resolves a promise previously created by _waitForData_.
         *
         * @memberof WebSocket
         */
        continue(): void;

        /**
         * Blocks the Vuser script until the connection to the server is closed.
         * The optional __timeout__ argument is in milliseconds.
         * Closure can occur due to the following:
         * 1. The server has closed the connection.
         * 2. _close_ was called on the WebSocket.
         * 3. The optional __timeout__ argument has passed and has expired.
         *
         * @param {number} timeout The timeout in milliseconds
         * @returns {Function}
         * @memberof WebSocket
         */
        waitForClose(timeout?: number): Promise<undefined>;

    }

    type errorHandlerCallback = (response: WebResponse) => void;

    export interface WebRequestOptions {
        /**
         * The url to which the request is sent.
         */
        url: string,
        /**
         * The HTTP method that will be used for the request.
         */
        method: string,
        /**
         * The id used to generate the corresponding snapshot file.
         */
        id?: number,
        /**
         * A key value store that maps the header name to its value.
         */
        headers: Object,
        /**
         * A list of resources that will be downloaded as part of the request. An element in the array
         * can be a string, in this case it will be used as the url of the resources and the rest of the parameters (e.g. headers)
         * will be the same as in the WebRequest.
         */
        resources: Array<String | Object>,
        /**
         * Determines how HTTP errors will be handled.
         * The possible values are:
         * **Function with the signature ```func(webResponse) : boolean```** - In this case the function will be called with the
         * WebResponse object received from the request. The user may change the received response and it will be returned from the
         * call to _sendSync_. The function return value affects how the current iteration continues execution.
         * In case the function returns ```false``` the iteration will continue running as usual.
         * In any other case the iteration will end immediately.
         * **A string** - In this case a log message will be printed with the given string and the iteration will continue as usual.
         * **```null```**  (default) - The error is not handled, the current iteration will end.
         */
        handleHTTPError: string | errorHandlerCallback,
        /**
         * The body of the request if the method supports a body (e.g. POST, PUT, etc).
         * If an object is provided it will be converted to a form data string automatically upon send. For example,
         * if body equals ```{"foo":"bar","bat":10}``` it will be automatically converted to ```foo=bar&bat=10```
         */
        body: string | Object,
        /**
         *  The path to a file whose content will be used as the body of the request. This can be a path relative to the
         * script directory or an absolute path. This property is only used if the _body_ property is not set.
         */
        bodyPath: string,
        /**
         * The delimiter that will be used for form body fields separation.
         */
        formDelimiter: string,
        /**
         * When true, the _body_ property of the ````WebResponse```` will be populated. Otherwise the _body_ property of the ````WebResponse```` will be set to ````null````.
         */
        returnBody: boolean,
        /**
         * When true, forces authentication header to be added to the request using the credentials provided by the ```load.setUserCredentials``` API. When false, wait for an HTTP 401 (unauthorized) before sending the credentials.
         */
        forceAuthentication: boolean,
        /**
         * A key value store that maps the query string options. You may specify more than one value per key using the array notation.
         * For example ``` { foo: "bar", baz: ["qux", "quux"], corge: "" }``` will result in the following query string ```"foo=bar&baz=qux&baz=quux&corge="```
         */
        queryString: Object,
        /**
         * An array that holds the extractor object to apply on the response of this ```WebRequest```.
         */
        extractors: Array<Object>
    }


    /**
     * An object that allows you sending web requests to the AUT. When creating a _WebRequest_ you can pass an options objects with all the configuration you need for the request.
     * Then you can send the request in either asynchronous or synchronous way.
     *
     * @export
     * @class WebRequest
     */
    export class WebRequest {
        /**
         * Creates a new WebRequest instance. The user may provide the _options_ argument
         * which will override any default options. The options must include at least a "url"
         * property which is mandatory, while all the other properties are optional. Alternatively,
         * you can call the constructor with a string argument and then this argument will be the url.
         */
        constructor(options: WebRequestOptions);

        /**
         * Sends the request to the defined URL (see constructor) and returns a promise which is
         * resolved with a _WebResponse_ object or rejected with an unhandled error.
         *
         * @returns {Promise < WebResponse >}
         * @memberof WebRequest
         */
        send(): Promise<WebResponse>;

        /**
         *The synchronous version of _send_. When called, the script execution is blocked until a response is returned. Returns the resulting _WebResponse_ object or
         throws an exception if an error occurs and the error is not handled by the user via an error handler (see below).

         HTTP errors are handled by setting the _handleHTTPError_ property of the _WebRequest_.

         *
         * @returns {WebResponse}
         * @memberof WebRequest
         */
        sendSync(): WebResponse;
    }


    export interface ResourceItem {
        /**
         * The URL of the resource.
         */
        url: string,
        /**
         * The status code that was returned when the resource was downloaded.
         */
        status: number,
        /**
         * The size (in bytes) of the downloaded resource.
         */
        size: number
    }

    /**
     * This object is returned as a WebRequest result. You do not need to create it on your own.

     *
     * @export
     * @class WebResponse
     */
    export class WebResponse {
        /**
         * The status code of the response.
         */
        status: number;
        /**
         * A key value store of the headers in the response sent by the server.
         */
        headers: object;
        /**
         * The size (in bytes) of the response.
         */
        size: number;
        /**
         * The UNIX timestamp in milliseconds of the engine time on which the request roundtrip has started.
         */
        startTime: number;
        /**
         *  The request roundtrip time in milliseconds. Only main request roundtrip time without resources and without redirections.
         */
        duration: number;
        /**
         * The body of the response. Note that the body is available only if the request had the property _returnBody_ set to ````true````.
         */
        body: string;
        /**
         * The body of the response as an object (only applicable when the body is a valid json). Note that jsonBody is available only if the request had the property _returnBody_ set to ````true````.
         */
        jsonBody: object;
        /**
         * The WebRequest object that caused this response to be generated.
         */
        request: WebRequest;
        /**
         * A list of all the resources that were downloaded as part of the request.
         */
        resources: [Array<ResourceItem>];
        /**
         * A list of all the URLs that passed through while redirecting to this response
         */
        redirectUrls: Array<string>;
        /**
         * The results of the extractor applied on the response (refer to the full documentation for more information on the format of this object).
         */
        extractors: object;

        /**
         * Checks if the given expression matches a substring within the body.
         * Note: textCheck works only if the request had the property returnBody set to true
         * @param expression can be either a string or a regular expression.
         * @returns true if the expression was found in the response body and false otherwise.
         */
        textCheck(expression: string): boolean
    }

    /**
     * You can send multipart web request by assigning the ```MultipartBody``` object as the body of a ```WebRequest```.
     */
    export class MultipartBody {
        /**
         * Creates a multipart body object with the given _entries_. The optional _boundary_ argument will be used to separate the entries within the sent body.
         * The _entries_ array should contain any of the available entry objects.
         * @param entries
         * @param boundary
         */
        constructor(entries: Array<FileEntry | StringEntry>, boundary: string)
    }

    export namespace MultipartBody {
        /**
         * Represents a file entry within a multipart request.
         */
        class FileEntry {
            /**
             * Creates a file entry object based on the given _name_ and _filePath_. You can specify
             * the content type via the _contentType_ argument.
             * You can specify the file name of the sent file via the _fileName_ argument.
             * @param name The name of the entry.
             * @param filePath The full path to the file.
             * @param contentType The content type of the entry. If content type was not specified ```text/plain``` will be used.
             * @param fileName The file name of the entry. If the file name is not specified it will be extracted from the _filePath_ argument.
             */
            constructor(name: string, filePath: string, contentType: string, fileName: string)
        }

        /**
         * Represents an entry of a single string.
         */
        class StringEntry {
            /**
             * Creates a string entry object based on the given _name_ and _value.
             * @param name The name of the entry.
             * @param value The value of the entry.
             */
            constructor(name: string, value: string)
        }
    }

    /**
     * Transactions are the means to measure the time it takes to execute certain, well defined, parts of the script.
     */
    export class Transaction {
        /**
         * Always set. The name of the transaction as it was passed to the constructor
         */
        readonly name: string;
        /**
         * The last known state of the current transaction.
         */
        state: load.TransactionState;
        /**
         * Set on call to _start_. The UNIX timestamp in milliseconds of the engine time on which the transaction has started.
         */
        startTime: number;
        /**
         * Set on call to _stop_, _set_, or _update_ . The number of milliseconds passed since the call to _start_ until the transaction was ended either by a call to _end_ or by the engine.
         */
        duration: number;
        /**
         * Always set but you may need to call _update_ to get the updated value.
         */
        status: load.TransactionStatus;

        /**
         * Creates a new transaction with the given _name_.
         * **Note:** The created transaction has the "NotStarted" state and you must call the ```start()``` method explicitly to start it.
         * @param name The name of the transaction.
         */
        constructor(name: string);

        /**
         * Starts the transaction and changes its _status_ to "InProgress".
         */
        start(): void;

        /**
         * Stops the transaction and changes its status to the current status of the transaction.
         * If the optional _status_ argument is provided then the stopped transaction will have the given
         * status and not the current transaction status. The valid values for _status_ are "Passed" and "Failed"
         * and can be taken from ```load.TransactionStatus.Passed``` and ````load.TransactionStatus.Failed````.
         * Calling _stop_ records the transaction duration in the _duration_ property.
         * @param status If set then the stopped transaction will have the given status.
         */
        stop(status?: load.TransactionStatus)

        /**
         * Sets the transaction _status_ and _duration_ to the given arguments.
         * The given _status_ must be one of "Passed"/"Failed" (from load.TransactionStatus) and the given
         * _duration_ must be a non-negative number of milliseconds for the transaction duration.
         * Note that you cannot call _set_ on a started transaction.
         * @param status The status to set, must be one of "Passed"/"Failed" (from load.TransactionStatus).
         * @param duration The duration of the transaction given in milliseconds.
         */
        set(status: load.TransactionStatus, duration: Number)

        /**
         * Updates the _status_, _state_, and _duration_ properties of the transaction object.
         * The transaction must be either started or ended for the call to succeed.
         * Returns the transaction object for piping.
         */
        update(): Transaction
    }

    enum TransactionState {
        NotStarted,
        InProgress,
        Ended
    }

    enum TransactionStatus {
        Passed,
        Failed
    }

    enum LogLevel {
        error,
        warning,
        info,
        debug,
        trace
    }

    enum ExitType {
        iteration,
        stop,
        abort
    }

    enum ExtractorOccurrenceType {
        First,
        Last,
        All
    }

    enum ExtractorScope {
        Body,
        Headers,
        All
    }
    /**
     * A global configuration object that is used to supply various configuration data to the running Vuser.
     */
    export class config {
        /**
         * A set of properties of the currently running Vuser
         */
        static user: {
            /**
             * The id of the currently running Vuser.
             */
            userId: number;
            /**
             * A map of key-value pairs supplied as command line arguments.
             */
            args: object;
        };
        /**
         * A set of properties of the currently running script.
         */
        static script: {
            /**
             * The name of the script itself that this Vuser runs.
             */
            name: string;
            /**
             * The directory path to the script that this Vuser runs.
             */
            directory: string;
            /**
             * The full path to the script that this Vuser runs.
             */
            fullPath: string;
        };
        /**
         * A set of properties of the host machine that runs the script.
         */
        static host: {
            /**
             * The name of the machine running the current Vuser
             */
            name: string;
            /**
             * The machine platform of the current Vuser
             */
            platform: string;
        };
        /**
         * An object that contains all the environment variables as key value pairs.
         * Note: The keys are case-sensitive, including on Windows.
         */

        static env: string;
        /**
         * Runtime properties of the Vuser script
         */
        static runtime: {
            /**
             * The number of the currently running iteration.
             */
            iteration: number;
        };
    }


    /**
     *Registers the given _callback to be run in the initialization phase of the test.
     The _callback may return a promise that will be used to determine if the _callback has succeeded or failed.
     *
     * @export
     * @param {async function} callback
     */
    export function initialize(callback: Function): void;

    /**
     *Registers the given _callback as a named action of the script with the given name. The actions will be run in the same order as they are registered by calls to load.action() as currently we do not support any kind of run logic. The _callback may return a promise that will be used to determine if the _callback has succeeded or failed.
     *
     * @export
     * @param {string} name
     * @param {function} callback
     */
    export function action(name: string, callback: Function): void;

    /**
     *Registers the given _callback to be run in the finalization phase of the test. The _callback may return a promise which will be used to determine if the _callback has succeeded or failed.
     *
     * @export
     * @param {function} callback
     */
    export function finalize(callback: Function): void;

    /**
     * The log function writes a message to the Vuser log.
     * @param message The message to write
     * @param logLevel Can be one of ```LogLevel.error```, ```LogLevel.warning```, ```LogLevel.info```, ```LogLevel.debug```, ```LogLevel.trace```. Default log level is info.
     */
    export function log(message: string | Error | Object, logLevel: load.LogLevel): void;

    /**
     * Pauses the running of the script for the given number of seconds (time can have fractional part to simulate milliseconds)
     * @param time The amount of secods to pause
     */
    export function sleep(time: Number): void;

    /**
     * Pauses the running of the script for the given number of seconds (time can have fractional part to simulate milliseconds)
     * @param time The amount of secods to pause
     */
    export function thinkTime(time: Number): void;

    /**
     * A function that allows you to stop the execution of the script.
     * The _exitType_ argument is a string and can be one of:
     * "iteration" (```ExitType.iteration```) - will stop the current iteration and continue to the next one after performing pacing.
     * "stop" (```ExitType.stop```) - will stop the current iteration and try to run the finalization section of the script, then exit.
     * "abort" (```ExitType.abort```) - will abort the execution of the script for the current Vuser (will not try to execute finalization).
     *
     * You may specify an optional _message_ argument which will be printed to the log.
     * @param exitType
     * @param message
     */
    export function exit(exitType: load.ExitType, message: string): void;

    export interface AuthenticationData {
        /**
         * The username for the authentication protocol.
         */
        username: string;
        /**
         * The password for the authentication protocol.
         */
        password: string;
        /**
         * A string specifying the host(s) to which this authentication record is applied.
         * It may contain a * to indicate any alphanumeric string. You may specify this field as * to match any host.
         * The _host_ field is the key of the authentication record. Therefore, creating a new authentication record with the same
         * host will overwrite the previous one. If two authentication records match the same host (via *) the first one registered will be used.
         */
        host: string;

        /**
         * The domain for which this authentication record is applicable.
         */
        domain: string;
    }

    /**
     * A function that allows you to specify authentication parameters for HTTP requests that require authentication.
     * The _authenticationData_ can be either an authentication record or an array of authentication records.
     * All subsequent requests will try to apply the given authentication data to any request that requires authentication.
     * @param authenticationData
     */
    export function setUserCredentials(authenticationData: AuthenticationData | Array<AuthenticationData>): void;

    /**
     * A function that allows you to unmask masked value. The _maskedValue_ argument is a string generated using DevWebUtils executable.
     * **Note:** Masking is not secure and anyone is able to unmask it.
     * @param maskedValue
     */
    export function unmask(maskedValue: string): string;

    /**
     * A function that allows you to decrypt encrypted value. The _encryptedValue_ argument is an encrypted string generated using DevWebUtils executable.
     **Note:** During runtime encryption key file should be supplied.
     * @param encryptedValue
     */
    export function decrypt(encryptedValue: string): string;

    /**
     * Parameters are values generated during runtime by the runtime engine and are exposed to the script
     * through the ````load.params```` variable. Each time you use a parameter variable, the next value will
     * be loaded automatically based on the next value selection strategy in the parameters definition file.
     */
    export var params: object;


    /**
     * An interface representing an extractor object which can extract a value based on a specific implementation.
     */
    export interface ExtractorObject {
    }

    /**
     * This constructor will create a extractor object for the boundary extractor.
     * It will search the headers and the body of the response for any string that begins with _leftBoundary_ and terminates
     * with _rightBoundary_, and return the first matching string between the two boundaries. If nothing is found then
     * ```null``` is returned. For additional options please use the next constructor version.
     *
     * @export
     * @param {string} name The name of the extractor
     * @param {string} leftBoundary The left boundary of the extracted value
     * @param {string} rightBoundary The right boundary of the extracted value
     * @returns {ExtractorObject}
     */
    export function BoundaryExtractor(name: string, leftBoundary: string, rightBoundary: string): ExtractorObject

    export interface BoundaryExtractorOptions {
        /**
         * The left boundary of the search.
         */
        leftBoundary: string;
        /**
         * The right boundary of the search.
         */
        rightBoundary: string;
        /**
         * The occurrence (previously Ordinal) of the result to return.
         * If _occurrence_ is not defined then the first occurrence is returned.
         * If _occurrence_ is set to a number, than the result with the given number index is returned.
         * If _occurrence_ is set to ```load.ExtractorOccurrenceType.All``` then all the found occurrences are returned as an array.
         * You may also set _occurrence_ to either ```load.ExtractorOccurrenceType.First``` or ```load.ExtractorOccurrenceType.Last``` to retrieve the first or the last occurrence appropriately.
         */
        occurrence?: ExtractorOccurrenceType | number;
        /**
         * If set to ```false``` then the search will be using case-sensitive comparison.
         * If _caseInsensitive_ is not defined then the search will be using case-insensitive comparison.
         */
        caseInsensitive?: boolean;
        /**
         * The scope that will be searched.
         * If _scope_ is not defined then only the response body will be searched.
         * If _scope_ is set to ```load.ExtractorScope.All``` then both the response headers and the response body are searched for _text_.
         * You may set _scope_ to ```load.ExtractorScope.Body``` or ```load.ExtractorScope.Headers``` to search only the response body or the response headers, respectively.
         */
        scope?: ExtractorScope;
        /**
         * If set to ```false``` then the search will not be performed on the headers and body of all the pages returned by redirection of the ```WebRequest```.
         */
        includeRedirections?: boolean;
        /**
         * The converters are applied to the extracted value and convert it from one format to another. The property value is a comma separated list of converters to run sequentially on the extracted value.
         * Supported converters are: ```urlEncode```, ```urlDecode```, ```htmlEscape```, ```htmlUnescape```, ```base64Encode```, ```base64Decode```
         */
        converters?: string;
        /**
         * If defined, this function will be called before the ```WebResponse``` is returned by ```send``` or ```sendSync``` on the extracted value. The arguments are _value_ - the extracted value, _request_ - the ```WebRequest``` from which the value was extracted, and _response_ - the ```WebResponse``` before the transformation.
         * Note that the order in which the transformations are called is the same order in which the extractors appear within ```WebRequest``` _extractors_ property.
         */
        transform?(value: string, request: WebRequest, response: WebResponse): string
    }

    /**
     * This constructor will create an extractor object for the boundary extractor.
     *
     */
    export function BoundaryExtractor(name: string, options: BoundaryExtractorOptions);

    /**
     * This constructor creates an extractor object for the regular expression extractor.
     * It searches the headers and the body of the response for the a match of the given regular expression and returns the first match of the first group.
     * The documentation for the regular expression syntax can be found here: [https://github.com/google/re2/wiki/Syntax](https://github.com/google/re2/wiki/Syntax).
     * If nothing is found then ```null``` is returned.
     *
     * @export
     * @param {string} name The name of the extractor
     * @param {string} expression The regular expression that will be used for the extraction
     * @param {string} flags The regular expression flags (see regular expression syntax documentation for more details).
     * @returns {ExtractorObject} If nothing is found then null is returned. For additional options please use the next constructor version.
     */
    export function RegexpExtractor(name: string, expression: string, flags: string): ExtractorObject

    export interface RegexpExtractorOptions {
        /**
         * The regular expression to search with.
         */
        expression: string;
        /**
         * The regular expression flags (see regular expression syntax documentation for more details).
         */
        flags: string;
        /**
         * The group number to return as a result (zero-based). If _groupNumber_ is not defined then the first group is returned.
         * You can set _groupNumber_ to 0, in this case both the full match and each search group in the regular expression are returned. The full match is returned as the ```full``` property of the result and each group is represented in the ```groups``` array in the result.
         */
        groupNumber?: number;
        /**
         * The occurrence (previously Ordinal) of the result to return.
         * If _occurrence_ is not defined then the first occurrence is returned.
         * If _occurrence_ is set to a number, than the result with the given number index is returned.
         * If _occurrence_ is set to ```load.ExtractorOccurrenceType.All``` then all the found occurrences are returned as an array. In this case each result is based on the _groupNumber_ parameter logic.
         * You may also set _occurrence_ to either ```load.ExtractorOccurrenceType.First``` or ```load.ExtractorOccurrenceType.Last``` to retrieve the first or the last occurrence appropriately.
         */
        occurrence?: ExtractorOccurrenceType | number;
        /**
         * The scope that will be searched.
         * If _scope_ is not defined then only the response body will be searched.
         * If _scope_ is set to ```load.ExtractorScope.All``` then both the response headers and the response body are searched for _text_.
         * You may set _scope_ to ```load.ExtractorScope.Body``` or ```load.ExtractorScope.Headers``` to search only the response body or the response headers, respectively.
         */
        scope?: ExtractorScope;
        /**
         * If set to ```false``` then the search will not be performed on the headers and body of all the pages returned by redirection of the ```WebRequest```.
         */
        includeRedirections?: boolean;
        /**
         * The converters are applied to the extracted value and convert it from one format to another. The property value is a comma separated list of converters to run sequentially on the extracted value.
         * Supported converters are: ```urlEncode```, ```urlDecode```, ```htmlEscape```, ```htmlUnescape```, ```base64Encode```, ```base64Decode```
         */
        converters?: string;
        /**
         *  If defined, this function will be called before the ```WebResponse``` is returned by ```send``` or ```sendSync``` on the extracted value. The arguments are _value_ - the extracted value, _request_ - the ```WebRequest``` from which the value was extracted, and _response_ - the ```WebResponse``` before the transformation.
         * Note that the order in which the transformations are called is the same order in which the extractors appear within ```WebRequest``` _extractors_ property.
         */
        transform?(value: string, request: WebRequest, response: WebResponse): string  // If defined, this function will be called before the ```WebResponse``` is returned by ```send``` or ```sendSync``` on the extracted value.
    }

    /**
     * This constructor creates an extractor object for the regular expression extractor.
     * It searches the headers and the body of the response for the a match of the given regular expression and returns the first match of the first group.
     * The documentation for the regular expression syntax can be found here: [https://github.com/google/re2/wiki/Syntax](https://github.com/google/re2/wiki/Syntax).
     * If nothing is found then ```null``` is returned.
     * @param name The name of the extractor
     * @param options The extractor options
     */
    export function RegexpExtractor(name: string, options: RegexpExtractorOptions): ExtractorObject

    export interface JsonPathExtractorOptions {
        /**
         * The JSON path to search with.
         */
        path: string;
        /**
         * If unspecified or is false, will return only the first result, otherwise will return an array with all the results.
         */
        returnMultipleValues?: boolean;
        /**
         * The converters are applied to the extracted value and convert it from one format to another. The property value is a comma separated list of converters to run sequentially on the extracted value.
         * Supported converters are: ```urlEncode```, ```urlDecode```, ```htmlEscape```, ```htmlUnescape```, ```base64Encode```, ```base64Decode```
         */
        converters?: string;
        /**
         * If defined, this function will be called before the ```WebResponse``` is returned by ```send``` or ```sendSync``` on the extracted value. The arguments are _value_ - the extracted value, _request_ - the ```WebRequest``` from which the value was extracted, and _response_ - the ```WebResponse``` before the transformation.
         * Note that the order in which the transformations are called is the same order in which the extractors appear within ```WebRequest``` _extractors_ property.
         */
        transform?(value: string, request: WebRequest, response: WebResponse): string
    }

    /**
     * This constructor will create an extractor object for the JSON path extractor.
     * It will search the body of the response (if it is a valid JSON) and return the matching objects(s).
     * If nothing is found then ```null``` is returned.
     * If _returnMultipleValues_ is unspecified or is false, will return only the first result, otherwise will return an array with all the results.
     * @param {string} name The name of the extractor.
     * @param {string} path The JSON path to search with.
     * @param {boolean} returnMultipleValues - false or unspecified will return the first item otherwise return list.
     */
    export function JsonPathExtractor(name: string, path: string, returnMultipleValues?: boolean): ExtractorObject;

    /**
     * This constructor will create an extractor object for the JSON path extractor.
     * It will search the body of the response (if it is a valid JSON) and return the matching objects(s).
     * If nothing is found then ```null``` is returned.
     * If _returnMultipleValues_ is unspecified or is false, will return only the first result, otherwise will return an array with all the results.
     * @param name The name of the extractor.
     * @param options The extractor options.
     */
    export function JsonPathExtractor(name: string, options: JsonPathExtractorOptions): ExtractorObject;

    export interface XpathExtractorOptions {
        /**
         * The Xpath to search with.
         */
        path: string;
        /**
         * If unspecified or is false, will return only the first result, otherwise will return an array with all the results.
         */
        returnMultipleValues?: boolean;
        /**
         * The converters are applied to the extracted value and convert it from one format to another. The property value is a comma separated list of converters to run sequentially on the extracted value.
         * Supported converters are: ```urlEncode```, ```urlDecode```, ```htmlEscape```, ```htmlUnescape```, ```base64Encode```, ```base64Decode```
         */
        converters?: string;
        /**
         * If defined, this function will be called before the ```WebResponse``` is returned by ```send``` or ```sendSync``` on the extracted value. The arguments are _value_ - the extracted value, _request_ - the ```WebRequest``` from which the value was extracted, and _response_ - the ```WebResponse``` before the transformation.
         * Note that the order in which the transformations are called is the same order in which the extractors appear within ```WebRequest``` _extractors_ property.
         */
        transform?(value: string, request: WebRequest, response: WebResponse): string
    }

    /**
     * This constructor will create an extractor object for the Xpath extractor.
     * It will search the body of the response (if it is a valid XML) and return the matching objects(s).
     * If nothing is found then ```null``` is returned.
     * If _returnMultipleValues_ is unspecified or is false, will return only the first result, otherwise will return an array with all the results.
     * @param {string} name The name of the extractor.
     * @param {string} path The XPath to search with.
     * @param {boolean} returnMultipleValues - false or unspecified will return the first item otherwise return list
     */
    export function XpathExtractor(name: string, path: string, returnMultipleValues?: boolean): ExtractorObject;

    /**
     * This constructor will create an extractor object for the Xpath extractor.
     * It will search the body of the response (if it is a valid XML) and return the matching objects(s).
     * If nothing is found then ```null``` is returned.
     * @param name The name of the extractor.
     * @param options The extractor options.
     */
    export function XpathExtractor(name: string, options: XpathExtractorOptions): ExtractorObject;

    export interface TextCheckExtractorOptions {
        /**
         * The string to search.
         */
        text: string;
        /**
         * The scope that will be searched.
         * If _scope_ is not defined then only the response body will be searched.
         * If _scope_ is set to ```load.ExtractorScope.All``` then both the response headers and the response body are searched for _text_.
         * You may set _scope_ to ```load.ExtractorScope.Body``` or ```load.ExtractorScope.Headers``` to search only the response body or the response headers, respectively.
         */
        scope?: string;
        /**
         * If defined, the actual result during runtime will be compared to this value and if equal an exception will be thrown stopping the script execution.
         */
        failOn?: any;
        /**
         * If set to ```false``` then the search will not be performed on the headers and body of all the pages returned by redirection of the ```WebRequest```.
         */
        includeRedirections?: boolean;
        /**
         * The converters are applied to the extracted value and convert it from one format to another. The property value is a comma separated list of converters to run sequentially on the extracted value.
         * Supported converters are: ```urlEncode```, ```urlDecode```, ```htmlEscape```, ```htmlUnescape```, ```base64Encode```, ```base64Decode```
         */
        converters?: string;
        /**
         * If defined, this function will be called before the ```WebResponse``` is returned by ```send``` or ```sendSync``` on the extracted value. The arguments are _value_ - the extracted value, _request_ - the ```WebRequest``` from which the value was extracted, and _response_ - the ```WebResponse``` before the transformation.
         * Note that the order in which the transformations are called is the same order in which the extractors appear within ```WebRequest``` _extractors_ property.
         */
        transform?(value: string, request: WebRequest, response: WebResponse): string
    }

    /**
     * This constructor will create an extractor object for the text check extractor.
     * It will return ```true``` if the given _text_ was found in the response based on the _scope_ argument.
     * If the given _text_ is not found then ```false``` is returned.
     * @param {string} name - The name of the extractor.
     * @param {string} text - The string to search.
     * @param {string} scope - The scope that will be searched.
     */
    export function TextCheckExtractor(name: string, text: string, scope?: string): ExtractorObject;
    /**
     * This constructor will create an extractor object for the text check extractor.
     * It will return ```true``` if the given _text_ was found in the response based on the _scope_ argument.
     * If the given _text_ is not found then ```false``` is returned.
     * @param name - The name of the extractor.
     * @param options - The options object for the extractor.
     */
    export function TextCheckExtractor(name: string, options: TextCheckExtractorOptions): ExtractorObject;

    /**
     *  This constructor will create an extractor object for the HTML extractor.
     * It will search the body of the response (if it is a valid HTML) and return all the objects matching the given CSS query.
     * If nothing is found then ```null``` is returned.
     * @param name - The name of the extractor.
     * @param query - The CSS query to use for finding the proper element.
     * @param attributeName - The name of the attribute whose value to extract.
     * @constructor
     */
    export function HtmlExtractor(name: string, query: string, attributeName: string): ExtractorObject;

    export interface HtmlExtractorOptions {
        /**
         * The CSS query selector to search with.
         */
        query: string;
        /**
         * The attribute whose value will be extracted. If not defined inner text is extracted.
         */
        attributeName: string;
        /**
         * The occurrence of the result to return.
         * If _occurrence_ is not defined then the first occurrence is returned.
         * If _occurrence_ is set to a number, than the result with the given number index is returned.
         * If _occurrence_ is set to ```load.ExtractorOccurrenceType.All``` then all the found occurrences are returned as an array.
         * You may also set _occurrence_ to either ```load.ExtractorOccurrenceType.First``` or ```load.ExtractorOccurrenceType.Last``` to retrieve the first or the last occurrence appropriately.
         */
        occurrence?: ExtractorOccurrenceType | number;
        /**
         * The converters are applied to the extracted value and convert it from one format to another. The property value is a comma separated list of converters to run sequentially on the extracted value.
         * Supported converters are: ```urlEncode```, ```urlDecode```, ```htmlEscape```, ```htmlUnescape```, ```base64Encode```, ```base64Decode```
         */
        converters?: string;
        /**
         * If defined, this function will be called before the ```WebResponse``` is returned by ```send``` or ```sendSync``` on the extracted value. The arguments are _value_ - the extracted value, _request_ - the ```WebRequest``` from which the value was extracted, and _response_ - the ```WebResponse``` before the transformation.
         * Note that the order in which the transformations are called is the same order in which the extractors appear within ```WebRequest``` _extractors_ property.
         */
        transform?(value: string, request: WebRequest, response: WebResponse): string
    }

    /**
     * This constructor will create an extractor object for the HTML extractor.
     * It will search the body of the response (if it is a valid HTML) and return all the objects matching the given CSS query.
     * If nothing is found then ```null``` is returned.
     * @param name - The name of the extractor
     * @param options - The options of the extractor
     * @constructor
     */
    export function HtmlExtractor(name: string, options: HtmlExtractorOptions): ExtractorObject;


    export interface CookieOptions {
        /**
         * The name of the cookie.
         */
        name: string;
        /**
         * The value of the cookie.
         */
        value: string;
        /**
         * The maximum lifetime of the cookie as an HTTP-date timestamp.
         */
        expires?: string;
        /**
         * Number of seconds until the cookie expires.
         */
        maxAge?: number;
        /**
         * The hosts to which the cookie will be sent.
         */
        domain: string;
        /**
         * A URL path that must exist in the requested resource before sending the Cookie header.
         */
        path?: string;
        /**
         * Indicates whether the cookies is secure or not.
         */
        isSecure?: boolean;
        /**
         * HTTP-only cookies aren't accessible via JavaScript.
         */
        isHttpOnly?: boolean;
        /**
         * Allows servers to assert that a cookie ought not to be sent along with cross-site requests.
         */
        sameSite?: "strict" | "lax"
    }


    export class Cookie {
        /**
         * Creates a cookie object that can be used in a ```setCookie``` call. The mandatory _options_ argument can be either
         * an object with the cookie fields or a string. See definitions in the ["Set-Cookie"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) command definition.
         * @param options
         */
        constructor(options: CookieOptions);

        /**
         * Takes a ```Cookie``` object or an array of ```Cookie``` objects and deletes them from the engine.
         * No error is returned if one or more of the given cookies don't exist in the engine (i.e. were not previously added by ```addCookies```).
         *
         * @param {(Cookie | Array<cookie>)} cookie
         * @memberof Cookie
         */
        deleteCookies(cookie: Cookie | Array<Cookie>): void;

        /**
         * Takes a ```Cookie``` object or an array of ```Cookie``` objects and adds them to the engine.
         * The cookies will be used when needed according to the url of the web request.
         *
         * @param {(Cookie | Array < Cookie >)} cookie
         * @memberof Cookie
         */
        addCookies(cookie: Cookie | Array<Cookie>): void;

        /**
         * Deletes all the cookies that were added to the engine via ```addCookies()```.
         *
         * @memberof Cookie
         */
        clearCookies(): void;
    }

    export interface Utils {
        /**
         *Returns the substring within the source string between leftBoundary and rightBoundary. If leftBoundary is undefined then the beginning of the source string is used as left boundary. If rightBoundary is undefined then the end of the source string is used as the right boundary. If either boundary is not found in the source string or the source string is invalid then null is returned.
         *
         * @param {string} source - The string to search within.
         * @param {string} leftBoundary - The left boundary of the search.
         * @param {string} rightBoundary - The right boundary of the search.
         * @returns {string}
         * @memberof utils
         */
        getByBoundary(source: string, leftBoundary: string, rightBoundary: string): string

        /**
         *Reports a data point with the given name and value to the results database. The reported value will be in the CustomDataPoints table in the results database. The timestamp and the reporting Vuser Id will be automatically added. Note that the value must be a number.
         *
         * @param {string} name - The name of the datapoint.
         * @param {number} value - The value of the datapoint (numeric).
         * @memberof utils
         */
        reportDataPoint(name: string, value: number)
    }

    export var utils: Utils;

    export interface VTSConnectOptions {
        /**
         * The name or IP address of the VTS server host. HTTP is assumed by default, unless the URL begins with HTTPS.
         */
        server: string
        /**
         * The port number.
         */
        port: number
        /**
         * The user name.
         */
        userName?: string
        /**
         * A plain text password.
         */
        password?: string
    }

    /**
     * The VTS integration API allows you to connect to a VTS server and perform various operations on it such as reading and writing from columns, managing indices, and more.
     *
     * @export
     * @class VTS
     */
    export function vtsConnect(options:VTSConnectOptions): VTSClient

    export enum VTSPlacementType {
        sameRow,
        stacked,
        unique
    }

    /**
     *The VTSClient is responsible for issuing commands to the VTS server.
     * Use it to obtain other VTS related constructs such as VTSColumn and VTSRow.
     * The client allows you to perform general operations which affect more than one column, row, or field.
     *
     * @export
     * @class VTSClient
     */
    export class VTSClient {
        /**
         * Returns a reference to a column in the VTS server with the given column name. Does not verify that the column actually exists.
         * @param columnName
         */
        getColumn(columnName: string): VTSColumn

        /**
         * Returns a reference to a row in the VTS server with the given row index. Does not verify that the row
         * actually exists but the index must be a non-negative number.
         * @param rowIndex
         */
        getRow(rowIndex: number): VTSRow

        /**
         * Creates a column on the VTS server and returns a reference to the created column.
         * @param columnName
         */
        createColumn(columnName: string): VTSColumn

        /**
         * Pops the first fields from specified columns. _columnNames_ is an array of the column names that will be popped.
         * If _columnNames_ is not specified then all the columns are popped. Returns an array of the values from the popped columns.
         *
         * Returns an object where each property key corresponds to a column name and each property value corresponds to the database value.
         *
         * @param columnNames
         */
        popColumns(columnNames: Array<string>): Object

        /**
         * Retrieves the first field from the specified columns and moves the value to the bottom.
         * _columnNames_ is an array of the column names that will be rotated.
         * If _columnNames_ is not specified then all the columns are rotated.
         * _placementType_ must be one of the following:
         *
         * **load.VTSPlacementType.stacked** - The data is sent to an available field at the bottom of the column.
         *
         * **load.VTSPlacementType.unique** - If the value of the first field already exists elsewhere in the column, the top field is retrieved and then discarded. Otherwise, data is sent to an available field at the bottom of the column.
         *
         * Returns an object where each property key corresponds to a column name and each property value corresponds to the database value.
         * @param columnNames
         * @param placementType
         */
        rotateColumns(columnNames: Array<string>, placementType: VTSPlacementType): Object

        /**
         * Sets the data given in _values_ into the columns given by _columnNames_.
         * The number of columns must be identical to the number of values provided.
         *
         * _placementType_ must be one of the following:
         * **load.VTSPlacementType.sameRow** - Send all the data to the same row.
         *
         * **load.VTSPlacementType.stacked** - Data is sent to available fields in each column according to VTS internal logic.
         *
         * **load.VTSPlacementType.unique** - Data is sent to available fields in each column only if the value does not already exist in the column it would be written to.
         * @param columnNames
         * @param values
         * @param placementType
         */
        setValues(columnNames: Array<string>, values: Array<string>, placementType: VTSPlacementType): Object

        /**
         * Replaces the given _newValue_ in all the columns that were specified by _columnNames_ and where the current field
         * value equals _existingValue_
         *
         * @param columnNames
         * @param newValue
         * @param existingValue
         */
        replaceExistingValue(columnNames: Array<string>, newValue: string, existingValue: string)
    }

    /**
     * The VTSColumn is a reference to a column in the VTS server. Use this object to perform operations on the underlying column.
     *
     * @export
     * @class VTSColumn
     */
    export class VTSColumn {
        readonly client: VTSClient;

        /**
         *Clears all data in a column.
         *
         * @memberof VTSColumn
         */
        clear(): void;

        /**
         * Returns the number of fields that contain data in a column.
         *
         * @returns {Number}
         * @memberof VTSColumn
         */
        size(): Number

        /**
         *Creates an index on a column. If a column is not indexed, the time required to execute addUnique() increases with the number of rows. If the column is indexed, the time for 'send if unique' operations is constant. For large databases, we recommend that you index columns you want to perform 'unique' operations. A column is locked while an index is being built on it. Any function calls that change the column are queued until the index build completes. If the index exists, this function has no effect.
         *
         * @memberof VTSColumn
         */
        createIndex(): void;

        /**
         *Deletes the index on a column.
         *
         * @memberof VTSColumn
         */
        dropIndex(): void;

        /**
         *Sets the last field of a column to a value. If there is no empty field in the column, a new row is created. If ifUniqe is true then checks if the value does not exist in the column. If the value already exists in the column, the function has no effect. If a column is not indexed, the time required to execute a addValue() with ifUnique set to true increases with the number of rows. If the column is indexed, the time is constant. For large databases, we recommend that you index columns you want to perform this operation on via createIndex().
         *
         * @param {string} value
         * @param {boolean} ifUnique
         * @memberof VTSColumn
         */
        addValue(value: string, ifUnique: boolean): void;

        /**
         * Clears the data in a field within the column defined by the rowIndex.
         *
         * @param {number} rowIndex
         * @memberof VTSColumn
         */
        clearField(rowIndex: number): void;

        /**
         * Changes the value in the field within the column defined by the rowIndex, by the amount passed in argument value. If the field value cannot be converted to an integer or if there is no data in the field, the field value after the call is value. Note that value must be a number.
         *
         * @param {number} rowIndex
         * @param {number} value
         * @memberof VTSColumn
         */
        incrementField(rowIndex: number, value: number): void;

        /**
         * Retrieves the data in a field . If there is no data in the field, the output is null.
         *
         * @param {number} rowIndex
         * @returns {string}
         * @memberof VTSColumn
         */
        getFieldValue(rowIndex: number): string | null

        /**
         * Writes the value to the field within the column defined by the rowIndex. If existingValue was specified, the existingValue and the field value match, the field value is overwritten.
         *
         * @param {number} rowIndex
         * @param {string} value
         * @param {string} existingValue
         * @memberof VTSColumn
         */
        setFieldValue(rowIndex: number, value: string, existingValue: string): void;

        /**
         *Retrieves the value from the field in the top row of the column. All fields below the first row move up one row. For example, after the call, the value that was in the second row in the column is in the first row, the value that was in the third row is in the second row, and so on. The last field in the column is cleared.
         *
         * @returns {string}
         * @memberof VTSColumn
         */
        pop(): string

        /**
         *Retrieves the data in the first field of the column. The data is removed from the first field and moved to the bottom of the column as specified by the placementType parameter. If there is no data in a cell, the output is null.
         * @param {VTSPlacementType} placementType placementType must be one of the following:
         load.VTSPlacementType.stacked - The data is sent to an available field at the bottom of the column.
         load.VTSPlacementType.unique - If the value of the first field already exists elsewhere in the column, the top field is retrieved and then discarded. Otherwise, data is sent to an available field at the bottom of the column.
         * @returns {string}
         * @memberof VTSColumn
         */
        rotate(placementType: VTSPlacementType): string | null
    }

    export class VTSRow {
        /**
         * the client which contains this row
         */
        readonly client: VTSClient;

        /**
         *Clears the values from all fields in a row. If a cell has a value, clear() sets the value to an empty string. Cells with no value are not affected. Querying such cells returns null before and after the call to clear().
         *
         * @memberof VTSColumn
         */
        clear(): void;

        /**
         *Retrieves the data in a row as an object which has a property that corresponds to each column name. If there is no data in a field, the corresponding output is null.
         *
         * @returns {Object}
         * @memberof VTSRow
         */
        getValues(): Object;

        /**
         * Sets the data given in values into the columns given by columnNames. The number of columns must be identical to the number of values provided.
         * placementType must be one of the following:
         * **load.VTSPlacementType.sameRow** - Send all the data to the same row.
         * **load.VTSPlacementType.stacked** - Data is sent to available fields in each column according to VTS internal logic.
         * **load.VTSPlacementType.unique** - Data is sent to available fields in each column only if the value does not already exist in the column it would be written to.
         *
         * @param {Array<string>} columnNames
         * @param {Array<string>} values
         * @memberof VTSRow
         */
        setValues(columnNames: Array<string>, values: Array<VTSPlacementType>): void;

    }


    export class Timer {

        /**
         * Creates a new timer that will call the given _callback_ function after, at least, _delay_ milliseconds.
         * It is possible to make the timer call the callback only once, or consecutively, using the appropriate methods.
         * @param callback the _callback to call each time the timer fires
         * @param delay interval time in [milliseconds]
         */
        constructor(callback: Function, delay: number);

        /**
         * stops the requested timer
         */
        stop(): Timer;

        /**
         * Starts a timer and sets it to call the callback each time the delay (in milliseconds) has passed.
         *
         * Each setTimeout must we followed by _timer.wait()_ or there may be undefined behaviour when the timer is used.
         * For example, the iteration might end before the timer fired.
         */
        startInterval(): Timer;

        /**
         * Starts a timer that will call the _callback_ when the time (in milliseconds) has passed.
         *
         * Each setTimeout must we followed by _timer.wait()_ or there may be undefined behaviour when the timer is used.
         * For example, the iteration might end before the timer fired.
         */
        startTimeout(): Timer;

        /**
         * Waits for the timeout or interval timer to finish before allowing the iteration to continue.
         * It **must** be accompanied by _await_, since it returns a promise.
         */
        wait(): Promise<undefined>;
    }

    export interface FileReadResult {
        /**
         * The entire content of the read file. This property is only available when "returnContent" is set to true in the _options_
         */
        content: string;
        /**
         * The extracted results of the given extractors. See the "Extractor results" section in the SDK documentation.
         */
        extractors: object;
    }

    export interface FileReadOptions {
        /**
         * When set to true, will ignore the caching mechanism and read the file from disk. Use this option only if the read file can change during the script run.
         */
        forceRead?: boolean
        /**
         * When true, the entire content of the file is returned (see extractors property for retrieving partial file data).
         */
        returnContent: boolean
        /**
         * The extracted results of the given extractors. See the "Extractor results" section in the SDK documentation.
         */
        extractors?: Array<ExtractorObject>
    }

    export class File {

        /**
         * Creates a file object that will perform operations on a file at the given path.
         * The engine controls the file lifecycle therefore you don't need to open/close the file.
         * @param path can be an absolute path or a relative path to the script directory.
         */
        constructor(path: string);

        /**
         * Reads the text file and returns the read value based on the given _options_.
         */
        read(options: FileReadOptions): FileReadResult;

        /**
         * Appends the given _content_ to the end of the file
         */
        append(content: string): void;
    }

}
