/** lzw_encode returns an lzw encoded version of a string */
export function lzw_encode(s: string): string {
    if (s === "") { return ""; }
    s = unescape(encodeURIComponent(s));
    var record: Record<string, number> = {};
    var result = [];

    var phrase = s[0];
    var code = 256;
    
    var currChar: string;
    for (var i = 1; i < s.length; i++) {
        currChar = s[i];
        if (record[phrase + currChar] !== undefined) {
            phrase += currChar;
            continue;
        }
        
        result.push(phrase.length > 1 ? record[phrase] : phrase.charCodeAt(0));
        record[phrase + currChar] = code;
        code++;
        phrase=currChar;
    }

    result.push(phrase.length > 1 ? record[phrase] : phrase.charCodeAt(0));

    var output = "";
    for (var i = 0; i < result.length; i++) {
        output += String.fromCharCode(result[i]);
    }

    return output;
}

/* lzw_decode decodes an lzw encoded version of a string */
export function lzw_decode(s: string): string {
    var currChar = s[0];

    var record: Record<number, string> = {};
    var result = [currChar];

    var oldPhrase = currChar;
    var phrase: string;

    var code = 256;
    var currCode: number;
    for (var i = 1; i < s.length; i++) {
        currCode = s.charCodeAt(i);
        if (currCode < 256) {
            phrase = s[i];
        } else {
           phrase = record[currCode] ? record[currCode] : (oldPhrase + currChar);
        }
        result.push(phrase);
        currChar = phrase.charAt(0);
        record[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }

    return decodeURIComponent(escape(result.join("")));
}

export function lzw_compile(s: string): string {
    return `function(o){for(var r,t,e=o[0],n={},u=[e],h=e,a=256,c=1;c<o.length;c++)r=(t=o.charCodeAt(c))<256?o[c]:n[t]?n[t]:h+e,u.push(r),e=r.charAt(0),n[a]=h+e,a++,h=r;return decodeURIComponent(escape(u.join("")))}(${JSON.stringify(lzw_encode(s))})`;
}

