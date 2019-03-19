
// This function will convert illegal characters to special codes in order to allow them to be stored in the database.
export const fixInput = (input) => {
    input.replace(/@/g, '~at0909~');
    input.replace(/%/g, '~percent0909~');
    input.replace(/{/g, '~leftcurlybracket0909~');
    input.replace(/}/g, '~rightcurlybracket0909~');
    input.replace(/&/g, '~and0909~');
    input.replace(/$/g, '~dollar0909~');
    return input
}


// This changes the filtered codes back to their original characters when they arrive back from the server.
export const fixOutput = (output) => {
    output.replace(/~at0909~/g, '@');
    output.replace(/~percent0909~/g, '%');
    output.replace(/~leftcurlybracket0909~/g, '{');
    output.replace(/~rightcurlybracket0909~/g, '}');
    output.replace(/~and0909~/g, '&');
    output.replace(/~dollar0909~/g, '$');
    return output
}