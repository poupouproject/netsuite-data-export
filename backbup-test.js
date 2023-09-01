/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/search', 'N/record', 'N/runtime', "SuiteScripts/LIB_FileDownload"],
  function(search, record, runtime, lib) {

    function onRequest(context) {
      // Set content type header for JSON response
      context.response.setHeader({
        name: 'Content-Type',
        value: 'APPLICATION/JSON'
      });

      // Get saved search by ID or name
      var savedSearch = search.load({
        id: 'customsearch_ec_biddesk_waitlink'
      });

      // Get search results 
      var searchResults = savedSearch.runPaged({
        pageSize: 1000
      });

      // Convert search results to JSON format
      var jsonData = _searchResultsToJSON(searchResults);

      // Write JSON output to response
      context.response.write(JSON.stringify(jsonData));
    }

    /**
     * Converts the search results to a JSON array
     * @param {Object} searchResults - The results from the saved search
     * @returns The data in JSON format
     */
    function _searchResultsToJSON(searchResults) {
      var data = [];

      searchResults.pageRanges.forEach(function(pageRange) {
        var page = searchResults.fetch({ index: pageRange.index });
        page.data.forEach(function(result) {
          var rowData = {};
          result.columns.forEach(function(column) {
            rowData[column.name] = result.getValue(column);
          });
          data.push(rowData);
        });
      });

      return data;
    }

    return {
      onRequest: onRequest
    };

});

---------------

/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/query', 'N/record', 'N/runtime', "SuiteScripts/LIB_FileDownload"],
  function(query, record, runtime, lib) {

    function onRequest(context) {
      // Set content type header for JSON response
      context.response.setHeader({
        name: 'Content-Type',
        value: 'APPLICATION/JSON'
      });

      // Run SuiteQL query with pagination
      var pagedData = query.runSuiteQLPaged({
        query: 'select * from transactionline',
        pageSize: 1000  // Number of rows per page
      });

      // Convert paged query results to JSON format
      var jsonData = _pagedQueryResultsToJSON(pagedData);

      // Write JSON output to response
      context.response.write(JSON.stringify(jsonData));
    }

    /**
     * Converts the paged SuiteQL query results to a JSON array
     * @param {Object} pagedData - The paged results from the SuiteQL query
     * @returns The data in JSON format
     */
    function _pagedQueryResultsToJSON(pagedData) {
      var data = [];

      for (var i = 0; i < pagedData.pageRanges.length; i++) {
        var pageRange = pagedData.pageRanges[i];
        var page = pagedData.fetch({ index: pageRange.index });
        for (var j = 0; j < page.data.length; j++) {
          data.push(page.data[j]);
        }
      }

      return data;
    }

    return {
      onRequest: onRequest
    };

});


------
