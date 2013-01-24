Ext.ButtonToggleMgr = function(){
    var A = {};
    function B(E, G){
        if (G) {
            var F = A[E.toggleGroup];
            for (var D = 0, C = F.length; D < C; D++) {
                if (F[D] != E) {
                    F[D].toggle(false)
                }
            }
        }
    }
    return {
        register: function(C){
            if (!C.toggleGroup) {
                return
            }
            var D = A[C.toggleGroup];
            if (!D) {
                D = A[C.toggleGroup] = []
            }
            D.push(C);
            C.on("toggle", B)
        },
        unregister: function(C){
            if (!C.toggleGroup) {
                return
            }
            var D = A[C.toggleGroup];
            if (D) {
                D.remove(C);
                C.un("toggle", B)
            }
        },
        getSelected: function(E, G, F){
            var H = A[E];
            for (var D = 0, C = H.length; D < C; D++) {
                if (H[D].pressed === true) {
                    if (G) {
                        G.call(F || H[D], H[D])
                    }
                    return H[D]
                }
            }
            return
        }
    }
}
();
Date.parseFunctions = {
    count: 0
};
Date.parseRegexes = [];
Date.formatFunctions = {
    count: 0
};
Date.prototype.dateFormat = function(B){
    if (Date.formatFunctions[B] == null) {
        Date.createNewFormat(B)
    }
    var A = Date.formatFunctions[B];
    return this[A]()
};
Date.prototype.format = Date.prototype.dateFormat;
Date.createNewFormat = function(format){
    var funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    var code = "Date.prototype." + funcName + " = function(){return ";
    var special = false;
    var ch = "";
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true
        }
        else {
            if (special) {
                special = false;
                code += "'" + String.escape(ch) + "' + "
            }
            else {
                code += Date.getFormatCode(ch)
            }
        }
    }
    eval(code.substring(0, code.length - 3) + ";}")
};
Date.getFormatCode = function(D){
    switch (D) {
        case "d":
            return "String.leftPad(this.getDate(), 2, '0') + ";
        case "D":
            return "Date.getShortDayName(this.getDay()) + ";
        case "j":
            return "this.getDate() + ";
        case "l":
            return "Date.dayNames[this.getDay()] + ";
        case "N":
            return "(this.getDay() ? this.getDay() : 7) + ";
        case "S":
            return "this.getSuffix() + ";
        case "w":
            return "this.getDay() + ";
        case "z":
            return "this.getDayOfYear() + ";
        case "W":
            return "String.leftPad(this.getWeekOfYear(), 2, '0') + ";
        case "F":
            return "Date.monthNames[this.getMonth()] + ";
        case "m":
            return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
        case "M":
            return "Date.getShortMonthName(this.getMonth()) + ";
        case "n":
            return "(this.getMonth() + 1) + ";
        case "t":
            return "this.getDaysInMonth() + ";
        case "L":
            return "(this.isLeapYear() ? 1 : 0) + ";
        case "o":
            return "(this.getFullYear() + (this.getWeekOfYear() == 1 && this.getMonth() > 0 ? +1 : (this.getWeekOfYear() >= 52 && this.getMonth() < 11 ? -1 : 0))) + ";
        case "Y":
            return "this.getFullYear() + ";
        case "y":
            return "('' + this.getFullYear()).substring(2, 4) + ";
        case "a":
            return "(this.getHours() < 12 ? 'am' : 'pm') + ";
        case "A":
            return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
        case "g":
            return "((this.getHours() % 12) ? this.getHours() % 12 : 12) + ";
        case "G":
            return "this.getHours() + ";
        case "h":
            return "String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0') + ";
        case "H":
            return "String.leftPad(this.getHours(), 2, '0') + ";
        case "i":
            return "String.leftPad(this.getMinutes(), 2, '0') + ";
        case "s":
            return "String.leftPad(this.getSeconds(), 2, '0') + ";
        case "u":
            return "String.leftPad(this.getMilliseconds(), 3, '0') + ";
        case "O":
            return "this.getGMTOffset() + ";
        case "P":
            return "this.getGMTOffset(true) + ";
        case "T":
            return "this.getTimezone() + ";
        case "Z":
            return "(this.getTimezoneOffset() * -60) + ";
        case "c":
            for (var F = Date.getFormatCode, G = "Y-m-dTH:i:sP", C = "", B = 0, A = G.length; B < A; ++B) {
                var E = G.charAt(B);
                C += E == "T" ? "'T' + " : F(E)
            }
            return C;
        case "U":
            return "Math.round(this.getTime() / 1000) + ";
        default:
            return "'" + String.escape(D) + "' + "
    }
};
Date.parseDate = function(A, C){
    if (Date.parseFunctions[C] == null) {
        Date.createParser(C)
    }
    var B = Date.parseFunctions[C];
    return Date[B](A)
};
Date.createParser = function(format){
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;
    var code = "Date." + funcName + " = function(input){\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, ms = -1, o, z, u, v;\ninput = String(input);var d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes[" + regexNum + "]);\nif (results && results.length > 0) {";
    var regex = "";
    var special = false;
    var ch = "";
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true
        }
        else {
            if (special) {
                special = false;
                regex += String.escape(ch)
            }
            else {
                var obj = Date.formatCodeToRegex(ch, currentGroup);
                currentGroup += obj.g;
                regex += obj.s;
                if (obj.g && obj.c) {
                    code += obj.c
                }
            }
        }
    }
    code += "if (u)\n{v = new Date(u * 1000);}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0 && ms >= 0)\n{v = new Date(y, m, d, h, i, s, ms);}\nelse if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{v = new Date(y, m, d, h, i, s);}\nelse if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{v = new Date(y, m, d, h, i);}\nelse if (y >= 0 && m >= 0 && d > 0 && h >= 0)\n{v = new Date(y, m, d, h);}\nelse if (y >= 0 && m >= 0 && d > 0)\n{v = new Date(y, m, d);}\nelse if (y >= 0 && m >= 0)\n{v = new Date(y, m);}\nelse if (y >= 0)\n{v = new Date(y);}\n}return (v && (z || o))?\n    (z ? v.add(Date.SECOND, (v.getTimezoneOffset() * 60) + (z*1)) :\n        v.add(Date.HOUR, (v.getGMTOffset() / 100) + (o / -100))) : v\n;}";
    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
    eval(code)
};
Date.formatCodeToRegex = function(G, F){
    switch (G) {
        case "d":
            return {
                g: 1,
                c: "d = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{2})"
            };
        case "D":
            for (var C = [], E = 0; E < 7; C.push(Date.getShortDayName(E)), ++E) {
            }
            return {
                g: 0,
                c: null,
                s: "(?:" + C.join("|") + ")"
            };
        case "j":
            return {
                g: 1,
                c: "d = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{1,2})"
            };
        case "l":
            return {
                g: 0,
                c: null,
                s: "(?:" + Date.dayNames.join("|") + ")"
            };
        case "N":
            return {
                g: 0,
                c: null,
                s: "[1-7]"
            };
        case "S":
            return {
                g: 0,
                c: null,
                s: "(?:st|nd|rd|th)"
            };
        case "w":
            return {
                g: 0,
                c: null,
                s: "[0-6]"
            };
        case "z":
            return {
                g: 0,
                c: null,
                s: "(?:\\d{1,3}"
            };
        case "W":
            return {
                g: 0,
                c: null,
                s: "(?:\\d{2})"
            };
        case "F":
            return {
                g: 1,
                c: "m = parseInt(Date.getMonthNumber(results[" + F + "]), 10);\n",
                s: "(" + Date.monthNames.join("|") + ")"
            };
        case "m":
            return {
                g: 1,
                c: "m = parseInt(results[" + F + "], 10) - 1;\n",
                s: "(\\d{2})"
            };
        case "M":
            for (var C = [], E = 0; E < 12; C.push(Date.getShortMonthName(E)), ++E) {
            }
            return {
                g: 1,
                c: "m = parseInt(Date.getMonthNumber(results[" + F + "]), 10);\n",
                s: "(" + C.join("|") + ")"
            };
        case "n":
            return {
                g: 1,
                c: "m = parseInt(results[" + F + "], 10) - 1;\n",
                s: "(\\d{1,2})"
            };
        case "t":
            return {
                g: 0,
                c: null,
                s: "(?:\\d{2})"
            };
        case "L":
            return {
                g: 0,
                c: null,
                s: "(?:1|0)"
            };
        case "o":
        case "Y":
            return {
                g: 1,
                c: "y = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{4})"
            };
        case "y":
            return {
                g: 1,
                c: "var ty = parseInt(results[" + F + "], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
                s: "(\\d{1,2})"
            };
        case "a":
            return {
                g: 1,
                c: "if (results[" + F + "] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
                s: "(am|pm)"
            };
        case "A":
            return {
                g: 1,
                c: "if (results[" + F + "] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
                s: "(AM|PM)"
            };
        case "g":
        case "G":
            return {
                g: 1,
                c: "h = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{1,2})"
            };
        case "h":
        case "H":
            return {
                g: 1,
                c: "h = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{2})"
            };
        case "i":
            return {
                g: 1,
                c: "i = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{2})"
            };
        case "s":
            return {
                g: 1,
                c: "s = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{2})"
            };
        case "u":
            return {
                g: 1,
                c: "ms = parseInt(results[" + F + "], 10);\n",
                s: "(\\d{3})"
            };
        case "O":
            return {
                g: 1,
                c:["o = results[",F,"];\n","var sn = o.substring(0,1);\n","var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);\n","var mn = o.substring(3,5) % 60;\n","o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n","    (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"] .join(""),
                s: "([+-]\\d{4})"
            };
        case "P":
            return {
                g: 1,
                c:["o = results[",F,"];\n","var sn = o.substring(0,1);\n","var hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60);\n","var mn = o.substring(4,6) % 60;\n","o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n","    (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"] .join(""),
                s: "([+-]\\d{2}:\\d{2})"
            };
        case "T":
            return {
                g: 0,
                c: null,
                s: "[A-Z]{1,4}"
            };
        case "Z":
            return {
                g: 1,
                c: "z = results[" + F + "] * 1;\nz = (-43200 <= z && z <= 50400)? z : null;\n",
                s: "([+-]?\\d{1,5})"
            };
        case "c":
            var H = Date.formatCodeToRegex, D = [];
            var A = [H("Y", 1), H("m", 2), H("d", 3), H("h", 4), H("i", 5), H("s", 6), H("P", 7)];
            for (var E = 0, B = A.length; E < B; ++E) {
                D.push(A[E].c)
            }
            return {
                g: 1,
                c: D.join(""),
                s: A[0].s + "-" + A[1].s + "-" + A[2].s + "T" + A[3].s + ":" + A[4].s + ":" + A[5].s + A[6].s
            };
        case "U":
            return {
                g: 1,
                c: "u = parseInt(results[" + F + "], 10);\n",
                s: "(-?\\d+)"
            };
        default:
            return {
                g: 0,
                c: null,
                s: Ext.escapeRe(G)
            }
    }
};
Date.prototype.getTimezone = function(){
    return this.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "")
};
Date.prototype.getGMTOffset = function(A){
    return (this.getTimezoneOffset() > 0 ? "-" : "+") + String.leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0") + (A ? ":" : "") + String.leftPad(this.getTimezoneOffset() % 60, 2, "0")
};
Date.prototype.getDayOfYear = function(){
    var A = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (var B = 0; B < this.getMonth(); ++B) {
        A += Date.daysInMonth[B]
    }
    return A + this.getDate() - 1
};
Date.prototype.getWeekOfYear = function(){
    var B = 86400000;
    var C = 7 * B;
    var D = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate() + 3) / B;
    var A = Math.floor(D / 7);
    var E = new Date(A * C).getUTCFullYear();
    return A - Math.floor(Date.UTC(E, 0, 7) / C) + 1
};
Date.prototype.isLeapYear = function(){
    var A = this.getFullYear();
    return !!((A & 3) == 0 && (A % 100 || (A % 400 == 0 && A)))
};
Date.prototype.getFirstDayOfMonth = function(){
    var A = (this.getDay() - (this.getDate() - 1)) % 7;
    return (A < 0) ? (A + 7) : A
};
Date.prototype.getLastDayOfMonth = function(){
    var A = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return (A < 0) ? (A + 7) : A
};
Date.prototype.getFirstDateOfMonth = function(){
    return new Date(this.getFullYear(), this.getMonth(), 1)
};
Date.prototype.getLastDateOfMonth = function(){
    return new Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth())
};
Date.prototype.getDaysInMonth = function(){
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()]
};
Date.prototype.getSuffix = function(){
    switch (this.getDate()) {
        case 1:
        case 21:
        case 31:
            return "st";
        case 2:
        case 22:
            return "nd";
        case 3:
        case 23:
            return "rd";
        default:
            return "th"
    }
};
Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Date.getShortMonthName = function(A){
    return Date.monthNames[A].substring(0, 3)
};
Date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Date.getShortDayName = function(A){
    return Date.dayNames[A].substring(0, 3)
};
Date.y2kYear = 50;
Date.monthNumbers = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
};
Date.getMonthNumber = function(A){
    return Date.monthNumbers[A.substring(0, 1).toUpperCase() + A.substring(1, 3).toLowerCase()]
};
Date.prototype.clone = function(){
    return new Date(this.getTime())
};
Date.prototype.clearTime = function(A){
    if (A) {
        return this.clone().clearTime()
    }
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this
};
if (Ext.isSafari) {
    Date.brokenSetMonth = Date.prototype.setMonth;
    Date.prototype.setMonth = function(A){
        if (A <= -1) {
            var D = Math.ceil(-A);
            var C = Math.ceil(D / 12);
            var B = (D % 12) ? 12 - D % 12 : 0;
            this.setFullYear(this.getFullYear() - C);
            return Date.brokenSetMonth.call(this, B)
        }
        else {
            return Date.brokenSetMonth.apply(this, arguments)
        }
    }
}
Date.MILLI = "ms";
Date.SECOND = "s";
Date.MINUTE = "mi";
Date.HOUR = "h";
Date.DAY = "d";
Date.MONTH = "mo";
Date.YEAR = "y";
Date.prototype.add = function(B, C){
    var D = this.clone();
    if (!B || C === 0) {
        return D
    }
    switch (B.toLowerCase()) {
        case Date.MILLI:
            D.setMilliseconds(this.getMilliseconds() + C);
            break;
        case Date.SECOND:
            D.setSeconds(this.getSeconds() + C);
            break;
        case Date.MINUTE:
            D.setMinutes(this.getMinutes() + C);
            break;
        case Date.HOUR:
            D.setHours(this.getHours() + C);
            break;
        case Date.DAY:
            D.setDate(this.getDate() + C);
            break;
        case Date.MONTH:
            var A = this.getDate();
            if (A > 28) {
                A = Math.min(A, this.getFirstDateOfMonth().add("mo", C).getLastDateOfMonth().getDate())
            }
            D.setDate(A);
            D.setMonth(this.getMonth() + C);
            break;
        case Date.YEAR:
            D.setFullYear(this.getFullYear() + C);
            break
    }
    return D
};
Date.prototype.between = function(C, A){
    var B = this.getTime();
    return C.getTime() <= B && B <= A.getTime()
};
sprintf = function(){
    if (!arguments || arguments.length < 1 || !RegExp) {
        return
    }
    var I = arguments[0];
    var G = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/;
    var Q = b = [], A = 0, E = 0;
    while (Q = G.exec(I)) {
        var H = Q[1], N = Q[2], R = Q[3], M = Q[4];
        var J = Q[5], F = Q[6], C = Q[7];
        E++;
        if (F == "%") {
            B = "%"
        }
        else {
            A++;
            if (A >= arguments.length) {
                alert("Error! Not enough function arguments (" + (arguments.length - 1) + ", excluding the string)\nfor the number of substitution parameters in string (" + A + " so far).")
            }
            var D = arguments[A];
            var O = "";
            if (N && N.substr(0, 1) == "'") {
                O = H.substr(1, 1)
            }
            else {
                if (N) {
                    O = N
                }
            }
            var K = true;
            if (R && R === "-") {
                K = false
            }
            var P = -1;
            if (M) {
                P = parseInt(M)
            }
            var L = -1;
            if (J && F == "f") {
                L = parseInt(J.substring(1))
            }
            var B = D;
            if (F == "b") {
                B = parseInt(D).toString(2)
            }
            else {
                if (F == "c") {
                    B = String.fromCharCode(parseInt(D))
                }
                else {
                    if (F == "d") {
                        B = parseInt(D) ? parseInt(D) : 0
                    }
                    else {
                        if (F == "u") {
                            B = Math.abs(D)
                        }
                        else {
                            if (F == "f") {
                                B = (L > -1) ? Math.round(parseFloat(D) * Math.pow(10, L)) / Math.pow(10, L) : parseFloat(D)
                            }
                            else {
                                if (F == "o") {
                                    B = parseInt(D).toString(8)
                                }
                                else {
                                    if (F == "s") {
                                        B = D
                                    }
                                    else {
                                        if (F == "x") {
                                            B = ("" + parseInt(D).toString(16)).toLowerCase()
                                        }
                                        else {
                                            if (F == "X") {
                                                B = ("" + parseInt(D).toString(16)).toUpperCase()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        I = H + B + C
    }
    return I
};
if (typeof Locale == "undefined") {
    var Locale = function(B, A){
        this._instance = true;
        this.LC_ALL = "C";
        this.LC_COLLATE = "C";
        this.LC_CTYPE = "C";
        this.LC_MESSAGES = "C";
        this.LC_MONETARY = "C";
        this.LC_NUMERIC = "C";
        this.LC_TIME = "C";
        this.setlocale(B, A)
    }
}
Locale.VERSION = "0.0.3";
Locale.EXPORT = ["LC_ALL", "LC_COLLATE", "LC_CTYPE", "LC_MESSAGES", "LC_MONETARY", "LC_NUMERIC", "LC_TIME"];
Locale.EXPORT_OK = ["setlocale"];
Locale.EXPORT_TAGS = {
    ":common": Locale.EXPORT,
    ":all": Locale.EXPORT.concat(Locale.EXPORT_OK)
};
Locale.prototype.TranslationLists = {};
Locale.LC_ALL = "LC_ALL";
Locale.LC_COLLATE = "LC_COLLATE";
Locale.LC_CTYPE = "LC_CTYPE";
Locale.LC_MESSAGES = "LC_MESSAGES";
Locale.LC_MONETARY = "LC_MONETARY";
Locale.LC_NUMERIC = "LC_NUMERIC";
Locale.LC_TIME = "LC_TIME";
Locale.setlocale = Locale.prototype.setlocale = function(B, A){
    return function(){
        if (A === null || typeof A == "undefined") {
            return this[B]
        }
        if (A == "") {
            A = (window.navigator.browserLanguage || window.navigator.language || "C").replace(/^(.{2}).?(.{2})?.*$/, function(C, D, E){
                return D.toLowerCase() + (E ? "_" + E.toUpperCase() : "")
            })
        }
        switch (B) {
            case Locale.LC_ALL:
                this.LC_ALL = A;
                this.LC_COLLATE = A;
                this.LC_CTYPE = A;
                this.LC_MESSAGES = A;
                this.LC_MONETARY = A;
                this.LC_NUMERIC = A;
                this.LC_TIME = A;
                break;
            case Locale.LC_COLLATE:
            case Locale.LC_CTYPE:
            case Locale.LC_MESSAGES:
            case Locale.LC_MONETARY:
            case Locale.LC_NUMERIC:
            case Locale.LC_TIME:
                this[B] = A;
                break;
            default:
                return false
        }
        return A
    }
.call(this._instance ? this : arguments.callee)
};
Locale.setlocale.LC_ALL = "C";
Locale.setlocale.LC_COLLATE = "C";
Locale.setlocale.LC_CTYPE = "C";
Locale.setlocale.LC_MESSAGES = "C";
Locale.setlocale.LC_MONETARY = "C";
Locale.setlocale.LC_NUMERIC = "C";
Locale.setlocale.LC_TIME = "C";
Locale.getTranslationData = function(B, A){
    var C = "";
    if (Locale.prototype.TranslationLists[B][A]) {
        C = Locale.prototype.TranslationLists[B][A]
    }
    return C
};
if (typeof ActiveXObject != "undefined" && typeof XMLHttpRequest == "undefined") {
    XMLHttpRequest = function(){
        try {
            return new ActiveXObject("Msxml2.XMLHTTP")
        } 
        catch (A) {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }
    }
}
if (typeof Locale.Gettext == "undefined") {
    Locale.Gettext = function(A){
        this.locale = typeof A == "string" ? new Locale(Locale.LC_ALL, A) : A || Locale;
        this.domain = "messages";
        this.category = Locale.LC_MESSAGES;
        this.suffix = "po";
        this.dir = "."
    };
    Locale.Gettext.call(Locale.Gettext)
}
Locale.Gettext.VERSION = "0.0.1";
Locale.Gettext.EXPORT = ["bindtextdomain", "textdomain", "dcgettext", "dcngettext", "dgettext", "dngettext", "gettext", "ngettext", "gettext_noop"];
Locale.Gettext.EXPORT_OK = ["_", "n_", "N_"];
Locale.Gettext.EXPORT_TAGS = {
    ":common": Locale.Gettext.EXPORT,
    ":all": Locale.Gettext.EXPORT.concat(Locale.Gettext.EXPORT_OK)
};
Locale.Gettext.prototype.bindtextdomain = function(B, A){
    this.dir = A;
    this.domain = B
};
Locale.Gettext.prototype.textdomain = function(A){
    this.domain = A
};
Locale.Gettext.prototype.getmsg = function(D, C, B){
    var A = this._getkey(C, D);
    return B || typeof Locale.Gettext.prototype._msgs[A] == "undefined" ? Locale.Gettext.prototype._msgs[A] = new Locale.Gettext.PO(this._url(C, D)) : Locale.Gettext.prototype._msgs[A]
};
Locale.Gettext.prototype._msgs = {};
Locale.Gettext.prototype._getkey = function(A, B){
    return this.dir + "/" + A + "/" + B
};
Locale.Gettext.prototype._url = function(B, C){
    try {
        var A = new XMLHttpRequest;
        A.open("POST", "index.php", false);
        A.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        A.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        A.send("method=Tinebase.getTranslations&application=" + C + "&jsonKey=" + Tine.Tinebase.Registry.get("jsonKey"));
        if (A.status == 200 || A.status == 304 || A.status == 0 || A.status == null) {
            return Ext.util.JSON.decode(A.responseText)
        }
    } 
    catch (D) {
        return ""
    }
};
Locale.Gettext.prototype.dcgettext = function(C, B, A){
    return this.getmsg(C, A).get(B) || B
};
Locale.Gettext.prototype.dcngettext = function(D, C, A, F, B){
    var E = this.getmsg(D, B);
    return (E.get(C, A) || [C, A])[E.plural(F)]
};
Locale.Gettext.prototype.dgettext = function(B, A){
    return this.dcgettext(B, A, this.category)
};
Locale.Gettext.prototype.dngettext = function(C, B, A, D){
    return this.dcngettext(C, B, A, D, this.category)
};
Locale.Gettext.prototype.gettext = Locale.Gettext.prototype._ = function(A){
    return this.dcgettext(this.domain, A, this.category)
};
Locale.Gettext.prototype.ngettext = Locale.Gettext.prototype.n_ = function(B, A, C){
    return this.dcngettext(this.domain, B, A, C, this.category)
};
Locale.Gettext.prototype.gettext_noop = Locale.Gettext.prototype.N_ = function(A){
    return A
};
(function(){
    for (var A in Locale.Gettext.prototype) {
        Locale.Gettext[A] = function(B){
            return function(){
                return B.apply(Locale.Gettext, arguments)
            }
        }
(Locale.Gettext.prototype[A])
    }
})();
if (typeof Locale.Gettext.PO == "undefined") {
    Locale.Gettext.PO = function(A){
        if (typeof A == "string" || A instanceof String) {
            this.msg = Locale.Gettext.PO.po2object(A)
        }
        else {
            if (A instanceof Object) {
                this.msg = A
            }
            else {
                this.msg = {}
            }
        }
    }
}
Locale.Gettext.PO.VERSION = "0.0.4";
Locale.Gettext.PO.EXPORT_OK = ["po2object", "po2json"];
Locale.Gettext.PO.po2object = function(po){
    return eval(Locale.Gettext.PO.po2json(po))
};
Locale.Gettext.PO.po2json = function(A){
    var C = true, B = false;
    return "({\n" + A.replace(/\r?\n/g, "\n").replace(/#.*\n/g, "").replace(/"(\s+)"/g, "").replace(/msgid "(.*?)"\nmsgid_plural "(.*?)"/g, 'msgid "$1, $2"').replace(/msg(\S+) /g, function(D, E){
        switch (E) {
            case "id":
                return C ? (C = false, "") : B ? (B = false, "]\n, ") : ", ";
            case "str":
                return ": ";
            case "str[0]":
                return B = true, ": [\n  ";
            default:
                return " ,"
        }
    }) + (B ? "]\n})" : "\n})")
};
Locale.Gettext.PO.prototype.get = function(B, A){
    return typeof A != "undefined" ? this.msg[B + ", " + A] : this.msg[B]
};
Locale.Gettext.PO.prototype.plural = function(n){
    var nplurals, plural;
    eval((this.msg[""] + "Plural-Forms: nplurals=2; plural=n != 1\n").match(/Plural-Forms:(.*)\n/)[1]);
    return plural === true ? 1 : plural === false ? 0 : plural
};
Ext.BLANK_IMAGE_URL = "ExtJS/resources/images/default/s.gif";
Ext.QuickTips.init();
if (!("console" in window) || !("firebug" in console)) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
    window.console = {};
    for (var i = 0; i < names.length; ++i) {
        window.console[names[i]] = function(){
        }
    }
}
Locale.setlocale(Locale.LC_ALL, "");
Locale.Gettext.textdomain("Tinebase");
_ = Locale.Gettext._;
n_ = Locale.Gettext.n_;
Ext.namespace("Tine.Tinebase");
Tine.Tinebase.Registry = new Ext.util.MixedCollection(true);
Ext.grid.ColumnModel.defaultRenderer = Ext.util.Format.htmlEncode;
Tine.Tinebase.initFramework = function(){
    var A = function(){
        Ext.Ajax.on("beforerequest", function(C, D){
            D.url = "index.php";
            D.params.jsonKey = Tine.Tinebase.Registry.get("jsonKey")
        }, this);
        Ext.Ajax.on("requestcomplete", function(D, C, E){
            if (C.responseText.charAt(0) == "<") {
                var H = 600;
                if (Ext.getBody().getHeight(true) * 0.7 < H) {
                    H = Ext.getBody().getHeight(true) * 0.7
                }
                var G = new Ext.Window({
                    width: 600,
                    height: H,
                    autoScroll: true,
                    title: "There where Errors",
                    html: C.responseText,
                    buttons: [new Ext.Action({
                        text: "ok",
                        handler: function(){
                            G.close()
                        }
                    })],
                    buttonAlign: "center"
                });
                G.show();
                return false
            }
            var F = Ext.util.JSON.decode(C.responseText);
            if (F.status && F.status.code != 200) {
            }
        }, this);
        Ext.Ajax.on("requestexception", function(D, E, K){
            if (E.status === 0) {
                alert("Connection lost, please check your network!")
            }
            var G = Ext.util.JSON.decode(E.responseText);
            var H = "";
            for (var I = 0, F = G.trace.length; I < F; I++) {
                H += (G.trace[I].file ? G.trace[I].file : "[internal function]") + (G.trace[I].line ? "(" + G.trace[I].line + ")" : "") + ": " + (G.trace[I]["class"] ? "<b>" + G.trace[I]["class"] + G.trace[I]["type"] + "</b>" : "") + "<b>" + G.trace[I]["function"] + "</b>(" + (G.trace[I]["args"][0] ? G.trace[I]["args"][0] : "") + ")<br/>"
            }
            var C = 600;
            if (Ext.getBody().getHeight(true) * 0.7 < C) {
                C = Ext.getBody().getHeight(true) * 0.7
            }
            var J = new Ext.Window({
                width: 800,
                height: C,
                autoScroll: true,
                title: G.msg,
                html: H,
                buttons: [new Ext.Action({
                    text: "ok",
                    handler: function(){
                        J.close()
                    }
                })],
                buttonAlign: "center"
            });
            J.show()
        }, this)
    };
    var B = function(){
        Ext.util.Format = Ext.apply(Ext.util.Format, {
            euMoney: function(C){
                C = (Math.round((C - 0) * 100)) / 100;
                C = (C == Math.floor(C)) ? C + ".00" : ((C * 10 == Math.floor(C * 10)) ? C + "0" : C);
                C = String(C);
                var G = C.split(".");
                var F = G[0];
                var D = G[1] ? "." + G[1] : ".00";
                var E = /(\d+)(\d{3})/;
                while (E.test(F)) {
                    F = F.replace(E, "$1.$2")
                }
                C = F + D;
                if (C.charAt(0) == "-") {
                    return C.substr(1) + " -â‚¬"
                }
                return C + " â‚¬"
            },
            percentage: function(C){
                if (C === null) {
                    return "none"
                }
                if (!isNaN(C)) {
                    return C + " %"
                }
            }
        })
    };
    A();
    B()
};
Tine.Tinebase.MainScreen = function(){
    var D = function(){
        var L = new Ext.Toolbar({
            id: "tineMenu",
            height: 26,
            items: [{
                text: "Tine 2.0",
                menu: {
                    id: "Tinebase_System_Menu",
                    items: [{
                        text: "Change password",
                        handler: G
                    }, "-", {
                        text: "Logout",
                        handler: A,
                        iconCls: "action_logOut"
                    }]
                }
            }, {
                text: "Admin",
                id: "Tinebase_System_AdminButton",
                iconCls: "AddressbookTreePanel",
                disabled: true,
                menu: {
                    id: "Tinebase_System_AdminMenu"
                }
            }, {
                text: "Preferences",
                id: "Tinebase_System_PreferencesButton",
                iconCls: "AddressbookTreePanel",
                disabled: true,
                menu: {
                    id: "Tinebase_System_PreferencesMenu"
                }
            }, "->", {
                text: _("Logout"),
                iconCls: "action_logOut",
                tooltip: {
                    text: _("Logout from Tine 2.0")
                },
                handler: A
            }]
        });
        var I = new Ext.Toolbar({
            id: "tineFooter",
            height: 26,
            items: ["Account name: " + Tine.Tinebase.Registry.get("currentAccount").accountDisplayName + " ", "Timezone: " + Tine.Tinebase.Registry.get("timeZone")]
        });
        var K = new Ext.Toolbar({
            id: "applicationToolbar",
            height: 26
        });
        K.on("render", function(){
            var M = Ext.getCmp("Addressbook_Tree");
            if (M) {
                M.expand()
            }
        });
        var J = new Ext.Panel({
            layout: "accordion",
            border: false,
            layoutConfig: {
                titleCollapse: true,
                animate: true,
                activeOnTop: true,
                hideCollapseTool: true
            },
            items: B()
        });
        var H = new Ext.Viewport({
            layout: "border",
            items: [{
                region: "north",
                id: "north-panel",
                split: false,
                height: 52,
                border: false,
                layout: "border",
                items: [{
                    region: "north",
                    height: 26,
                    border: false,
                    id: "north-panel-1",
                    items: [L]
                }, {
                    region: "center",
                    height: 26,
                    border: false,
                    id: "north-panel-2",
                    items: [K]
                }]
            }, {
                region: "south",
                id: "south",
                border: false,
                split: false,
                height: 26,
                initialSize: 26,
                items: [I]
            }, {
                region: "center",
                id: "center-panel",
                animate: true,
                useShim: true,
                border: false,
                layout: "fit"
            }, {
                region: "west",
                id: "west",
                split: true,
                width: 200,
                minSize: 100,
                maxSize: 300,
                border: false,
                collapsible: true,
                containerScroll: true,
                collapseMode: "mini",
                layout: "fit",
                defaults: {},
                items: J
            }]
        })
    };
    var B = function(){
        var I = [];
        for (var L in Tine) {
            try {
                for (var J = 0, H = Tine[L]["rights"].length; J < H; J++) {
                    if (Tine[L]["rights"][J] == "run") {
                        I.push(Tine[L].getPanel());
                        break
                    }
                }
            } 
            catch (K) {
            }
        }
        return I
    };
    var G = function(H){
        var L = new Ext.form.TextField({
            inputType: "password",
            hideLabel: false,
            id: "oldPassword",
            fieldLabel: "old password",
            name: "oldPassword",
            allowBlank: false,
            anchor: "100%",
            selectOnFocus: true
        });
        var M = new Ext.form.TextField({
            inputType: "password",
            hideLabel: false,
            id: "newPassword",
            fieldLabel: "new password",
            name: "newPassword",
            allowBlank: false,
            anchor: "100%",
            selectOnFocus: true
        });
        var K = new Ext.form.TextField({
            inputType: "password",
            hideLabel: false,
            id: "newPasswordSecondTime",
            fieldLabel: "new password again",
            name: "newPasswordSecondTime",
            allowBlank: false,
            anchor: "100%",
            selectOnFocus: true
        });
        var J = new Ext.FormPanel({
            baseParams: {
                method: "Tinebase.changePassword"
            },
            labelAlign: "top",
            bodyStyle: "padding:5px",
            anchor: "100%",
            region: "center",
            id: "changePasswordPanel",
            deferredRender: false,
            items: [L, M, K]
        });
        _savePassword = function(){
            if (J.getForm().isValid()) {
                var O = J.getForm().getValues().oldPassword;
                var P = J.getForm().getValues().newPassword;
                var N = J.getForm().getValues().newPasswordSecondTime;
                if (P == N) {
                    Ext.Ajax.request({
                        url: "index.php",
                        waitTitle: "Please wait!",
                        waitMsg: "changing password...",
                        params: {
                            method: "Tinebase.changePassword",
                            oldPassword: O,
                            newPassword: P
                        },
                        success: function(Q, R, S){
                            Ext.getCmp("changePassword_window").hide();
                            Ext.MessageBox.show({
                                title: "Success",
                                msg: "Your password has been changed.",
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.SUCCESS
                            })
                        },
                        failure: function(Q, R){
                            Ext.MessageBox.show({
                                title: "Failure",
                                msg: "Your old password is incorrect.",
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            })
                        }
                    })
                }
                else {
                    Ext.MessageBox.show({
                        title: "Failure",
                        msg: "The new passwords mismatch, please correct them.",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    })
                }
            }
        };
        var I = new Ext.Window({
            title: "Change password for " + Tine.Tinebase.Registry.get("currentAccount").accountDisplayName,
            id: "changePassword_window",
            modal: true,
            width: 350,
            height: 230,
            minWidth: 350,
            minHeight: 230,
            layout: "fit",
            plain: true,
            buttons: [{
                text: "Ok",
                handler: _savePassword
            }, {
                text: "Cancel",
                handler: function(){
                    Ext.getCmp("changePassword_window").hide()
                }
            }],
            bodyStyle: "padding:5px;",
            buttonAlign: "center"
        });
        I.add(J);
        I.show()
    };
    var A = function(H){
        Ext.MessageBox.confirm("Confirm", "Are you sure you want to logout?", function(I, J){
            if (I == "yes") {
                Ext.MessageBox.wait("Logging you out...", "Please wait!");
                Ext.Ajax.request({
                    params: {
                        method: "Tinebase.logout"
                    },
                    callback: function(M, L, K){
                        window.location = window.location
                    }
                })
            }
        })
    };
    var C = function(J){
        var H = Ext.getCmp("center-panel");
        if (H.items) {
            for (var I = 0; I < H.items.length; I++) {
                H.remove(H.items.get(I))
            }
        }
        H.add(J);
        H.doLayout()
    };
    var E = function(){
        var H = Ext.getCmp("north-panel-2");
        if (H.items) {
            return H.items.get(0)
        }
        else {
            return false
        }
    };
    var F = function(H){
        var J = Ext.getCmp("north-panel-2");
        if (J.items) {
            for (var I = 0; I < J.items.length; I++) {
                J.remove(J.items.get(I))
            }
        }
        J.add(H);
        J.doLayout()
    };
    return {
        display: D,
        getActiveToolbar: E,
        setActiveToolbar: F,
        setActiveContentPanel: C
    }
}
();
Tine.Tinebase.Common = function(){
    var B = function(E, F, G, I){
        var N, K, M, L, H, J, D;
        if (document.all) {
            N = document.body.clientWidth;
            K = document.body.clientHeight;
            M = window.screenTop;
            L = window.screenLeft
        }
        else {
            if (window.innerWidth) {
                N = window.innerWidth;
                K = window.innerHeight;
                M = window.screenX;
                L = window.screenY
            }
        }
        H = ((N - G) / 2) + L;
        J = ((K - I) / 2) + M;
        D = window.open(F, E, "width=" + G + ",height=" + I + ",top=" + J + ",left=" + H + ",directories=no,toolbar=no,location=no,menubar=no,scrollbars=no,status=no,resizable=yes,dependent=no");
        return D
    };
    _dateTimeRenderer = function(D){
        return Ext.util.Format.date(D, "d.m.Y H:i:s")
    };
    _dateRenderer = function(D){
        return Ext.util.Format.date(D, "d.m.Y")
    };
    _timeRenderer = function(D){
        return Ext.util.Format.date(D, "H:i:s")
    };
    _usernameRenderer = function(H, G, F, D, E, I){
        return Ext.util.Format.htmlEncode(H.accountDisplayName)
    };
    _accountRenderer = function(D, G, J, H, K, L){
        var E, I, F;
        if (D.accountDisplayName) {
            E = "user";
            F = D.accountDisplayName
        }
        else {
            if (D.name) {
                E = "group";
                F = D.name
            }
            else {
                if (J.data.name) {
                    E = J.data.type;
                    F = J.data.name
                }
                else {
                    if (J.data.account_name) {
                        E = J.data.account_type;
                        F = J.data.account_name
                    }
                }
            }
        }
        I = E == "user" ? "renderer renderer_accountUserIcon" : "renderer renderer_accountGroupIcon";
        return '<div class="' + I + '">&#160;</div>' + Ext.util.Format.htmlEncode(F)
    };
    var C = function(D){
        if (Ext.isEmpty(D)) {
            return false
        }
        var H = D.data;
        var F = H.getCount();
        var E = [];
        for (i = 0; i < F; i++) {
            var G = H.itemAt(i).data;
            E.push(G)
        }
        return Ext.util.JSON.encode(E)
    };
    var A = function(D, E){
        if (Ext.isEmpty(D) || Ext.isEmpty(E)) {
            return false
        }
        var J = D.data, H = J.getCount();
        var G = [];
        var K = E.length;
        if (K < 1) {
            return false
        }
        for (var F = 0; F < H; F++) {
            var I = [];
            I[0] = {};
            I[0][E[0]] = J.itemAt(F).data.key;
            I[0][E[1]] = J.itemAt(F).data.value;
            G.push(I[0])
        }
        return Ext.util.JSON.encode(G)
    };
    return {
        dateTimeRenderer: _dateTimeRenderer,
        dateRenderer: _dateRenderer,
        usernameRenderer: _usernameRenderer,
        accountRenderer: _accountRenderer,
        timeRenderer: _timeRenderer,
        openWindow: B,
        getJSONdata: C,
        getJSONdataSKeys: A
    }
}
();
Ext.grid.RowExpander = function(A){
    Ext.apply(this, A);
    this.addEvents({
        beforeexpand: true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });
    Ext.grid.RowExpander.superclass.constructor.call(this);
    if (this.tpl) {
        if (typeof this.tpl == "string") {
            this.tpl = new Ext.Template(this.tpl)
        }
        this.tpl.compile()
    }
    this.state = {};
    this.bodyContent = {}
};
Ext.extend(Ext.grid.RowExpander, Ext.util.Observable, {
    header: "",
    width: 20,
    sortable: false,
    fixed: true,
    dataIndex: "",
    id: "expander",
    lazyRender: true,
    enableCaching: false,
    getRowClass: function(A, E, D, C){
        D.cols = D.cols - 1;
        var B = this.bodyContent[A.id];
        if (!B && !this.lazyRender) {
            B = this.getBodyContent(A, E)
        }
        if (B) {
            D.body = B
        }
        return this.state[A.id] ? "x-grid3-row-expanded" : "x-grid3-row-collapsed"
    },
    init: function(B){
        this.grid = B;
        var A = B.getView();
        A.getRowClass = this.getRowClass.createDelegate(this);
        A.enableRowBody = true;
        B.on("render", function(){
            A.mainBody.on("mousedown", this.onMouseDown, this)
        }, this)
    },
    getBodyContent: function(A, B){
        if (!this.enableCaching) {
            return this.tpl.apply(A.data)
        }
        var C = this.bodyContent[A.id];
        if (!C) {
            C = this.tpl.apply(A.data);
            this.bodyContent[A.id] = C
        }
        return C
    },
    onMouseDown: function(B, A){
        if (A.className == "x-grid3-row-expander") {
            B.stopEvent();
            var C = B.getTarget(".x-grid3-row");
            this.toggleRow(C)
        }
    },
    renderer: function(B, C, A){
        C.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>'
    },
    beforeExpand: function(B, A, C){
        if (this.fireEvent("beforexpand", this, B, A, C) !== false) {
            if (this.tpl && this.lazyRender) {
                A.innerHTML = this.getBodyContent(B, C)
            }
            return true
        }
        else {
            return false
        }
    },
    toggleRow: function(A){
        if (typeof A == "number") {
            A = this.grid.view.getRow(A)
        }
        this[Ext.fly(A).hasClass("x-grid3-row-collapsed") ? "expandRow" : "collapseRow"](A)
    },
    expandRow: function(C){
        if (typeof C == "number") {
            C = this.grid.view.getRow(C)
        }
        var B = this.grid.store.getAt(C.rowIndex);
        var A = Ext.DomQuery.selectNode("tr:nth(2) div.x-grid3-row-body", C);
        if (this.beforeExpand(B, A, C.rowIndex)) {
            this.state[B.id] = true;
            Ext.fly(C).replaceClass("x-grid3-row-collapsed", "x-grid3-row-expanded");
            this.fireEvent("expand", this, B, A, C.rowIndex)
        }
    },
    collapseRow: function(C){
        if (typeof C == "number") {
            C = this.grid.view.getRow(C)
        }
        var B = this.grid.store.getAt(C.rowIndex);
        var A = Ext.fly(C).child("tr:nth(1) div.x-grid3-row-body", true);
        if (this.fireEvent("beforcollapse", this, B, A, C.rowIndex) !== false) {
            this.state[B.id] = false;
            Ext.fly(C).replaceClass("x-grid3-row-expanded", "x-grid3-row-collapsed");
            this.fireEvent("collapse", this, B, A, C.rowIndex)
        }
    }
});
Tine.Tinebase.hasRight = function(D, C){
    var A = false;
    for (var B = 0; B < Tine.Admin.rights.length; B++) {
        if (Tine.Admin.rights[B] == "admin") {
            A = true;
            break
        }
        if (D == "view" && (Tine.Admin.rights[B] == "view_" + C || Tine.Admin.rights[B] == "manage_" + C)) {
            A = true;
            break
        }
        if (D == "manage" && Tine.Admin.rights[B] == "manage_" + C) {
            A = true;
            break
        }
    }
    return A
};
Ext.namespace("Tine", "Tine.Tinebase", "Tine.Tinebase.Model");
Tine.Tinebase.Model.User = Ext.data.Record.create([{
    name: "accountId"
}, {
    name: "accountDisplayName"
}, {
    name: "accountLastName"
}, {
    name: "accountFirstName"
}, {
    name: "accountFullName"
}]);
Tine.Tinebase.Model.Group = Ext.data.Record.create([{
    name: "id"
}, {
    name: "name"
}, {
    name: "description"
}]);
Tine.Tinebase.Model.Role = Ext.data.Record.create([{
    name: "id"
}, {
    name: "name"
}, {
    name: "description"
}]);
Tine.Tinebase.Model.Account = Ext.data.Record.create([{
    name: "id"
}, {
    name: "type"
}, {
    name: "name"
}, {
    name: "data"
}]);
Tine.Tinebase.Model.Grant = Ext.data.Record.create([{
    name: "id"
}, {
    name: "accountId"
}, {
    name: "accountType"
}, {
    name: "readGrant",
    type: "boolean"
}, {
    name: "addGrant",
    type: "boolean"
}, {
    name: "editGrant",
    type: "boolean"
}, {
    name: "deleteGrant",
    type: "boolean"
}, {
    name: "adminGrant",
    type: "boolean"
}]);
Tine.Tinebase.Model.Tag = Ext.data.Record.create([{
    name: "id"
}, {
    name: "app"
}, {
    name: "owner"
}, {
    name: "name"
}, {
    name: "type"
}, {
    name: "description"
}, {
    name: "color"
}, {
    name: "occurrence"
}, {
    name: "rights"
}, {
    name: "contexts"
}]);
Ext.namespace("Tine.Tinebase.container");
Tine.Tinebase.container = {
    GRANT_NONE: 0,
    GRANT_READ: 1,
    GRANT_ADD: 2,
    GRANT_EDIT: 4,
    GRANT_DELETE: 8,
    GRANT_ADMIN: 16,
    GRANT_ANY: 31,
    TYPE_INTERNAL: "internal",
    TYPE_PERSONAL: "personal",
    TYPE_SHARED: "shared"
};
Ext.namespace("Ext.ux");
Ext.ux.ButtonLockedToggle = Ext.extend(Ext.Button, {
    enableToggle: true,
    toggle: function(A){
        if (A === undefined && this.pressed) {
            return
        }
        A = A === undefined ? !this.pressed : A;
        if (A != this.pressed) {
            if (A) {
                this.el.addClass("x-btn-pressed");
                this.pressed = true;
                this.fireEvent("toggle", this, true)
            }
            else {
                this.el.removeClass("x-btn-pressed");
                this.pressed = false;
                this.fireEvent("toggle", this, false)
            }
            if (this.toggleHandler) {
                this.toggleHandler.call(this.scope || this, this, A)
            }
        }
    }
});
Ext.reg("btnlockedtoggle", Ext.ux.ButtonLockedToggle);
Ext.reg("tbbtnlockedtoggle", Ext.ux.ButtonLockedToggle);
Ext.namespace("Ext.ux");
Ext.ux.PercentCombo = Ext.extend(Ext.form.ComboBox, {
    autoExpand: false,
    blurOnSelect: false,
    displayField: "value",
    valueField: "key",
    mode: "local",
    triggerAction: "all",
    emptyText: "percent ...",
    lazyInit: false,
    initComponent: function(){
        Ext.ux.PercentCombo.superclass.initComponent.call(this);
        if (!this.value) {
            this.value = 0
        }
        this.store = new Ext.data.SimpleStore({
            fields: ["key", "value"],
            data: [["0", "0%"], ["10", "10%"], ["20", "20%"], ["30", "30%"], ["40", "40%"], ["50", "50%"], ["60", "60%"], ["70", "70%"], ["80", "80%"], ["90", "90%"], ["100", "100%"]]
        });
        if (this.autoExpand) {
            this.on("focus", function(){
                this.lazyInit = false;
                this.selectByValue(this.getValue());
                this.expand()
            })
        }
        if (this.blurOnSelect) {
            this.on("select", function(){
                this.fireEvent("blur", this)
            }, this)
        }
    }
});
Ext.ux.PercentRenderer = function(A){
    return '<div class="x-progress-wrap TasksProgress"><div class="x-progress-inner TasksProgress"><div class="x-progress-bar TasksProgress" style="width:' + A + '%"><div class="TasksProgressText TasksProgress"><div>' + A + '%</div></div></div><div class="x-progress-text x-progress-text-back TasksProgress"><div>&#160;</div></div></div></div>'
};
Ext.namespace("Ext.ux");
Ext.ux.PopupWindow = Ext.extend(Ext.Component, {
    url: null,
    name: "new window",
    width: 500,
    height: 500,
    initComponent: function(){
        Ext.ux.PopupWindow.superclass.initComponent.call(this);
        this.addEvents({
            update: true,
            close: true
        });
        this.popup = Tine.Tinebase.Common.openWindow(this.name, this.url, this.width, this.height);
        this.popup.ParentEventProxy = this
    },
    setupPopupEvents: function(){
        this.Ext.onReady(function(){
        }, this)
    }
});
Ext.namespace("Ext.ux");
Ext.ux.Wizard = function(A){
    var B = Ext.apply({
        layout: "card",
        activeItem: 0,
        bodyStyle: "paddingTop:15px",
        defaults: {
            border: false
        },
        buttons: [{
            text: "Previous",
            handler: this.movePrevious,
            scope: this,
            disabled: true
        }, {
            text: "Next",
            handler: this.moveNext,
            scope: this
        }, {
            text: "Finish",
            handler: this.finishHanlder,
            scope: this,
            disabled: true
        }, {
            text: "Cancel",
            handler: this.hideHanlder,
            scope: this
        }]
    }, A ||
    {});
    this.currentItem = 0;
    this.template = new Ext.Template("Step {current} of {count}");
    this.mandatorySteps = B.mandatorySteps;
    Ext.ux.Wizard.superclass.constructor.call(this, B);
    this.addEvents("leave", "activate", "finish", "cancel");
    this.on("render", function(){
        this.footer.addClass("x-panel-footer-wizard");
        this.footer.insertFirst({
            html: '<div class="x-panel-footer-wizard-status">&nbsp;</div>'
        });
        this.setStatus();
        return true
    })
};
Ext.extend(Ext.ux.Wizard, Ext.Panel, {
    getCurrentStep: function(){
        return this.currentItem + 1
    },
    getStepCount: function(){
        return this.items.items.length
    },
    setCurrentStep: function(A){
        this.move(A - 1)
    },
    beforeMove: function(C, A, B){
        return this.fireEvent("leave", C, A, B)
    },
    setStatus: function(){
        var E = 0;
        var C = 1;
        var G = 2;
        var A = 3;
        var F = (this.getCurrentStep() == 1);
        var B = (this.getCurrentStep() == this.getStepCount());
        var D = isNaN(parseInt(this.mandatorySteps)) ? this.getStepCount() : Math.min(Math.max(parseInt(this.mandatorySteps), 1), this.getStepCount());
        this.buttons[E].setDisabled(F);
        this.buttons[C].setDisabled(B);
        this.buttons[G].setDisabled(!(B || (D < this.getCurrentStep())));
        this.footer.first("div div", true).firstChild.innerHTML = this.template.applyTemplate({
            current: this.getCurrentStep(),
            count: this.getStepCount()
        })
    },
    move: function(A){
        if (A >= 0 && A < this.items.items.length) {
            if (this.beforeMove(this.layout.activeItem, this.items.items[A], A > this.currentItem)) {
                this.layout.setActiveItem(A);
                this.currentItem = A;
                this.setStatus();
                this.fireEvent("activate", this.layout.activeItem)
            }
        }
    },
    moveNext: function(A, B){
        this.move(this.currentItem + 1)
    },
    movePrevious: function(A, B){
        this.move(this.currentItem - 1)
    },
    hideHanlder: function(){
        if (this.fireEvent("cancel")) {
            this.hide()
        }
    },
    finishHanlder: function(){
        if (this.fireEvent("finish")) {
            this.hide()
        }
    }
});
Ext.namespace("Ext.ux");
Ext.ux.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    paramName: "query",
    selectOnFocus: true,
    emptyText: "enter searchfilter",
    validationEvent: false,
    validateOnBlur: false,
    trigger1Class: "x-form-clear-trigger",
    trigger2Class: "x-form-search-trigger",
    hideTrigger1: true,
    width: 180,
    hasSearch: false,
    initComponent: function(){
        Ext.ux.SearchField.superclass.initComponent.call(this);
        this.on("specialkey", function(A, B){
            if (B.getKey() == B.ENTER) {
                this.onTrigger2Click()
            }
        }, this)
    },
    onTrigger1Click: function(){
        if (this.hasSearch) {
            this.el.dom.value = "";
            this.fireEvent("change", this, this.getRawValue(), this.startValue);
            this.startValue = this.getRawValue();
            this.triggers[0].hide();
            this.hasSearch = false
        }
    },
    onTrigger2Click: function(){
        var A = this.getRawValue();
        if (A.length < 1) {
            this.onTrigger1Click();
            return
        }
        this.fireEvent("change", this, this.getRawValue(), this.startValue);
        this.startValue = this.getRawValue();
        this.hasSearch = true;
        this.triggers[0].show()
    }
});
Ext.namespace("Ext.ux", "Ext.ux.grid");
Ext.ux.grid.CheckColumn = function(A){
    Ext.apply(this, A);
    if (!this.id) {
        this.id = Ext.id()
    }
    this.renderer = this.renderer.createDelegate(this)
};
Ext.ux.grid.CheckColumn.prototype = {
    init: function(A){
        this.grid = A;
        this.grid.on("render", function(){
            var B = this.grid.getView();
            B.mainBody.on("mousedown", this.onMouseDown, this)
        }, this)
    },
    onMouseDown: function(D, C){
        if (C.className && C.className.indexOf("x-grid3-cc-" + this.id) != -1) {
            D.stopEvent();
            var B = this.grid.getView().findRowIndex(C);
            var A = this.grid.store.getAt(B);
            A.set(this.dataIndex, !A.data[this.dataIndex])
        }
    },
    renderer: function(B, C, A){
        C.css += " x-grid3-check-col-td";
        return '<div class="x-grid3-check-col' + (B ? "-on" : "") + " x-grid3-cc-" + this.id + '">&#160;</div>'
    }
};
Ext.namespace("Ext.ux", "Ext.ux.grid");
Ext.ux.grid.QuickaddGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
    quickaddMandatory: false,
    initComponent: function(){
        Ext.ux.grid.QuickaddGridPanel.superclass.initComponent.call(this);
        this.addEvents("newentry");
        this.getView().templates = {
            header: this.makeHeaderTemplate()
        };
        this.quickaddHandlers = {
            scope: this,
            blur: function(){
                this.doBlur.defer(250, this)
            },
            specialkey: function(A, B){
                if (B.getKey() == B.ENTER) {
                    B.stopEvent();
                    A.el.blur();
                    if (A.triggerBlur) {
                        A.triggerBlur()
                    }
                }
            }
        }
    },
    onRender: function(B, A){
        Ext.ux.grid.QuickaddGridPanel.superclass.onRender.apply(this, arguments);
        Ext.each(this.getVisibleCols(), function(C){
            if (C.quickaddField) {
                C.quickaddField.render("new-" + C.id);
                C.quickaddField.setDisabled(C.id != this.quickaddMandatory);
                C.quickaddField.on(this.quickaddHandlers)
            }
        }, this);
        this.on("resize", this.syncFields);
        this.on("columnresize", this.syncFields);
        this.syncFields();
        this.colModel.getColumnById(this.quickaddMandatory).quickaddField.on("focus", this.onMandatoryFocus, this)
    },
    doBlur: function(){
        var B;
        Ext.each(this.getVisibleCols(), function(C){
            if (C.quickaddField.hasFocus) {
                B = true
            }
        }, this);
        if (!B) {
            var A = {};
            Ext.each(this.getVisibleCols(), function(C){
                A[C.id] = C.quickaddField.getValue();
                C.quickaddField.setDisabled(C.id != this.quickaddMandatory)
            }, this);
            if (this.colModel.getColumnById(this.quickaddMandatory).quickaddField.getValue() != "") {
                if (this.fireEvent("newentry", A)) {
                    this.colModel.getColumnById(this.quickaddMandatory).quickaddField.setValue("")
                }
            }
        }
    },
    getVisibleCols: function(){
        var B = [];
        var A = this.colModel;
        var E = A.getColumnCount();
        for (var C = 0; C < E; C++) {
            if (!A.isHidden(C)) {
                var D = A.getColumnId(C);
                B.push(A.getColumnById(D))
            }
        }
        return B
    },
    makeHeaderTemplate: function(){
        var A = "";
        Ext.each(this.getVisibleCols(), function(B){
            A += '<td><div class="x-small-editor" id="new-' + B.id + '"></div></td>'
        }, this);
        return new Ext.Template('<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">', '<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>', '<tbody><tr class="new-row">', A, "</tr></tbody>", "</table>")
    },
    syncFields: function(){
        var B = 2;
        if (Ext.isSafari) {
            B = 11
        }
        var A = this.colModel;
        Ext.each(this.getVisibleCols(), function(C){
            if (C.quickaddField) {
                C.quickaddField.setSize(A.getColumnWidth(A.getIndexById(C.id)) - B)
            }
        }, this)
    },
    onMandatoryFocus: function(){
        Ext.each(this.getVisibleCols(), function(A){
            A.quickaddField.setDisabled(false)
        }, this)
    }
});
Ext.namespace("Ext.ux.file");
Ext.ux.file.Uploader = function(A){
    Ext.apply(this, A);
    Ext.ux.file.Uploader.superclass.constructor.apply(this, arguments);
    this.addEvents("uploadcomplete")
};
Ext.extend(Ext.ux.file.Uploader, Ext.util.Observable, {
    maxFileSize: 2097152,
    url: "index.php",
    createForm: function(){
        var A = Ext.getBody().createChild({
            tag: "form",
            action: this.url,
            method: "post",
            cls: "x-hidden",
            id: Ext.id(),
            cn: [{
                tag: "input",
                type: "hidden",
                name: "MAX_FILE_SIZE",
                value: this.maxFileSize
            }]
        });
        return A
    },
    upload: function(){
        var B = this.createForm();
        B.appendChild(this.input);
        this.record = new Ext.ux.file.Uploader.file({
            input: this.input,
            form: B,
            status: "uploading"
        });
        var A = Ext.Ajax.request({
            isUpload: true,
            method: "post",
            form: B,
            scope: this,
            success: this.onUploadSuccess,
            params: {
                method: "Tinebase.uploadTempFile"
            }
        });
        this.record.set("request", A);
        return this
    },
    getRecord: function(){
        return this.record
    },
    onUploadSuccess: function(A, C){
        var B = Ext.util.JSON.decode(A.responseText).tempFile;
        this.record.set("status", "complete");
        this.record.set("tempFile", B);
        this.fireEvent("uploadcomplete", this, this.record)
    },
    getFileName: function(){
        return this.input.getValue().split(/[\/\\]/).pop()
    },
    getFilePath: function(){
        return this.input.getValue().replace(/[^\/\\]+$/, "")
    },
    getFileCls: function(){
        var A = this.getFileName().split(".");
        if (A.length === 1) {
            return ""
        }
        else {
            return A.pop().toLowerCase()
        }
    },
    isImage: function(){
        var A = this.getFileCls();
        return (A == "jpg" || A == "gif" || A == "png" || A == "jpeg")
    }
});
Ext.ux.file.Uploader.file = Ext.data.Record.create([{
    name: "id",
    type: "text",
    system: true
}, {
    name: "status",
    type: "text",
    system: true
}, {
    name: "tempFile",
    system: true
}, {
    name: "form",
    system: true
}, {
    name: "input",
    system: true
}, {
    name: "request",
    system: true
}]);
Ext.namespace("Ext.ux", "Ext.ux.form");
Ext.ux.form.IconTextField = Ext.extend(Ext.form.TextField, {
    labelIcon: "",
    initComponent: function(){
        Ext.ux.form.IconTextField.superclass.initComponent.call(this);
        if (this.labelIcon.length > 0) {
            this.fieldLabel = '<img src="' + this.labelIcon + '" class="x-ux-form-icontextfield-labelicon">' + this.fieldLabel
        }
    }
});
Ext.reg("icontextfield", Ext.ux.form.IconTextField);
Ext.namespace("Ext.ux", "Ext.ux.form");
Ext.ux.form.MirrorTextField = Ext.extend(Ext.ux.form.IconTextField, {
    initComponent: function(){
        Ext.ux.form.MirrorTextField.superclass.initComponent.call(this);
        Ext.ux.form.MirrorTextFieldManager.register(this)
    },
    setValue: function(A){
        Ext.ux.form.MirrorTextFieldManager.setAll(this, A)
    },
    onDestroy: function(){
        if (this.rendered) {
            Ext.ux.form.MirrorTextFieldManager.unregister(this)
        }
    }
});
Ext.reg("mirrortextfield", Ext.ux.form.MirrorTextField);
Ext.ux.form.MirrorTextFieldManager = function(){
    var B = {};
    function A(H, G, E){
        var C = B[H.name];
        for (var F = 0, D = C.length; F < D; F++) {
            C[F].setRawValue(G)
        }
        return true
    }
    return {
        register: function(D){
            var C = B[D.name];
            if (!C) {
                C = B[D.name] = []
            }
            C.push(D);
            D.on("change", A)
        },
        unregister: function(D){
            var C = B[D.name];
            if (C) {
                C.remove(D);
                D.un("change", toggleGroup)
            }
        },
        setAll: function(E, D){
            var C = B[E.name];
            if (C) {
                A(E, D)
            }
        }
    }
}
();
Ext.namespace("Ext.ux", "Ext.ux.form");
Ext.ux.form.ColumnFormPanel = Ext.extend(Ext.Panel, {
    formDefaults: {
        xtype: "icontextfield",
        anchor: "100%",
        labelSeparator: "",
        columnWidth: 0.333
    },
    layout: "hfit",
    labelAlign: "top",
    initComponent: function(){
        var B = [];
        for (var D = 0, C = this.items.length; D < C; D++) {
            var H = this.items[D];
            var F = {
                border: false,
                layout: "column",
                items: []
            };
            for (var G = 0, A = H.length; G < A; G++) {
                var E = H[G];
                F.items.push({
                    columnWidth: E.columnWidth ? E.columnWidth : this.formDefaults.columnWidth,
                    layout: "form",
                    labelAlign: this.labelAlign,
                    defaults: this.formDefaults,
                    bodyStyle: "padding-right: 5px;",
                    border: false,
                    items: E
                })
            }
            B.push(F)
        }
        this.items = B;
        Ext.ux.form.ColumnFormPanel.superclass.initComponent.call(this)
    }
});
Ext.reg("columnform", Ext.ux.form.ColumnFormPanel);
Ext.namespace("Ext.ux", "Ext.ux.form");
Ext.ux.form.ExpandFieldSet = Ext.extend(Ext.form.FieldSet, {
    initComponent: function(){
        Ext.ux.form.ExpandFieldSet.superclass.initComponent.call(this);
        var A = 0;
        this.items.each(function(B){
            if (A > 0) {
                B.collapsed = true;
                B.on("expand", function(){
                    var C = this.getInnerWidth();
                    B.setWidth(C)
                }, this)
            }
            A++
        }, this);
        this.collapsed = true
    },
    onRender: function(B, A){
        Ext.ux.form.ExpandFieldSet.superclass.onRender.call(this, B, A);
        this.el.addClass("x-tool-expand")
    },
    expand: function(A){
        var B = 0;
        this.items.each(function(C){
            if (B > 0) {
                C.expand(A)
            }
            B++
        }, this);
        this.el.removeClass("x-tool-expand");
        this.el.addClass("x-tool-collapse");
        this.collapsed = false
    },
    collapse: function(A){
        var B = 0;
        this.items.each(function(C){
            if (B > 0) {
                C.collapse(A)
            }
            B++
        }, this);
        this.el.removeClass("x-tool-collapse");
        this.el.addClass("x-tool-expand");
        this.collapsed = true
    }
});
Ext.reg("expanderfieldset", Ext.ux.form.ExpandFieldSet);
Ext.namespace("Ext.ux", "Ext.ux.form");
Ext.ux.form.ClearableComboBox = Ext.extend(Ext.form.ComboBox, {
    initComponent: function(){
        Ext.ux.form.ClearableComboBox.superclass.initComponent.call(this);
        this.triggerConfig = {
            tag: "span",
            cls: "x-form-twin-triggers",
            style: "padding-right:2px",
            cn: [{
                tag: "img",
                src: Ext.BLANK_IMAGE_URL,
                cls: "x-form-trigger x-form-clear-trigger"
            }, {
                tag: "img",
                src: Ext.BLANK_IMAGE_URL,
                cls: "x-form-trigger"
            }]
        }
    },
    getTrigger: function(A){
        return this.triggers[A]
    },
    initTrigger: function(){
        var A = this.trigger.select(".x-form-trigger", true);
        this.wrap.setStyle("overflow", "hidden");
        var B = this;
        A.each(function(D, F, C){
            D.hide = function(){
                var G = B.wrap.getWidth();
                this.dom.style.display = "none";
                B.el.setWidth(G - B.trigger.getWidth())
            };
            D.show = function(){
                var G = B.wrap.getWidth();
                this.dom.style.display = "";
                B.el.setWidth(G - B.trigger.getWidth())
            };
            var E = "Trigger" + (C + 1);
            if (this["hide" + E]) {
                D.dom.style.display = "none"
            }
            D.on("click", this["on" + E + "Click"], this, {
                preventDefault: true
            });
            D.addClassOnOver("x-form-trigger-over");
            D.addClassOnClick("x-form-trigger-click")
        }, this);
        this.triggers = A.elements;
        this.triggers[0].hide()
    },
    onTrigger1Click: function(){
        this.reset();
        this.fireEvent("select", this, this.getRawValue(), this.startValue);
        this.startValue = this.getRawValue();
        this.triggers[0].hide()
    },
    onTrigger2Click: function(){
        this.onTriggerClick()
    },
    onSelect: function(C, A, B){
        Ext.ux.form.ClearableComboBox.superclass.onSelect.call(this, C, A, B);
        this.startValue = this.getValue();
        this.triggers[0].show()
    }
});
Ext.namespace("Ext.ux", "Ext.ux.form");
Ext.ux.form.ClearableDateField = Ext.extend(Ext.form.DateField, {
    initComponent: function(){
        Ext.ux.form.ClearableDateField.superclass.initComponent.call(this);
        this.triggerConfig = {
            tag: "span",
            cls: "x-form-twin-triggers",
            cn: [{
                tag: "img",
                src: Ext.BLANK_IMAGE_URL,
                cls: "x-form-trigger x-form-clear-trigger"
            }, {
                tag: "img",
                src: Ext.BLANK_IMAGE_URL,
                cls: "x-form-trigger"
            }]
        }
    },
    getTrigger: function(A){
        return this.triggers[A]
    },
    initTrigger: function(){
        var A = this.trigger.select(".x-form-trigger", true);
        this.wrap.setStyle("overflow", "hidden");
        var B = this;
        A.each(function(D, F, C){
            D.hide = function(){
                var G = B.wrap.getWidth();
                this.dom.style.display = "none";
                B.el.setWidth(G - B.trigger.getWidth())
            };
            D.show = function(){
                var G = B.wrap.getWidth();
                this.dom.style.display = "";
                B.el.setWidth(G - B.trigger.getWidth())
            };
            var E = "Trigger" + (C + 1);
            if (this["hide" + E]) {
                D.dom.style.display = "none"
            }
            D.on("click", this["on" + E + "Click"], this, {
                preventDefault: true
            });
            D.addClassOnOver("x-form-trigger-over");
            D.addClassOnClick("x-form-trigger-click")
        }, this);
        this.triggers = A.elements;
        this.triggers[0].hide()
    },
    validateValue: function(A){
        if (A !== this.emptyText && A !== undefined && A.length > "1") {
            this.triggers[0].show()
        }
        return true
    },
    onTrigger1Click: function(){
        this.reset();
        this.fireEvent("select", this, "", "");
        this.triggers[0].hide()
    },
    onTrigger2Click: function(){
        this.onTriggerClick()
    }
});
Ext.namespace("Ext.ux.form");
Ext.ux.form.ImageField = Ext.extend(Ext.form.Field, {
    defaultImage: "images/empty_photo.jpg",
    defaultAutoCreate: {
        tag: "input",
        type: "hidden"
    },
    initComponent: function(){
        Ext.ux.form.ImageField.superclass.initComponent.call(this);
        this.imageSrc = this.defaultImage
    },
    onRender: function(B, A){
        Ext.ux.form.ImageField.superclass.onRender.call(this, B, A);
        this.buttonCt = Ext.DomHelper.insertFirst(B, "<div>&nbsp;</div>", true);
        this.buttonCt.setSize(this.width, this.height);
        this.buttonCt.on("contextmenu", this.onContextMenu, this);
        this.imageCt = Ext.DomHelper.insertFirst(this.buttonCt, this.getImgTpl().apply(this), true);
        this.bb = new Ext.ux.form.BrowseButton({
            buttonCt: this.buttonCt,
            renderTo: this.buttonCt,
            scope: this,
            handler: this.onFileSelect
        })
    },
    getValue: function(){
        var A = Ext.ux.form.ImageField.superclass.getValue.call(this);
        return A
    },
    setValue: function(A){
        Ext.ux.form.ImageField.superclass.setValue.call(this, A);
        this.imageSrc = A ? A : this.defaultImage;
        this.updateImage()
    },
    onFileSelect: function(C){
        var A = C.detachInputFile();
        var B = new Ext.ux.file.Uploader({
            input: A
        });
        if (!B.isImage()) {
            Ext.MessageBox.alert("Not An Image", "Plase select an image file (gif/png/jpeg)").setIcon(Ext.MessageBox.ERROR);
            return
        }
        this.buttonCt.mask("Loading", "x-mask-loading");
        B.upload();
        B.on("uploadcomplete", function(E, D){
            this.imageSrc = "index.php?method=Tinebase.getImage&application=Tinebase&location=tempFile&id=" + D.get("tempFile").id + "&width=" + this.width + "&height=" + (this.height - 2) + "&ratiomode=0";
            this.setValue(this.imageSrc);
            this.updateImage()
        }, this)
    },
    onContextMenu: function(D, A){
        D.preventDefault();
        var C = Ext.DomHelper.append(this.buttonCt, "<div>&nbsp;</div>", true);
        var B = new Ext.menu.Item({
            text: "Change Image",
            iconCls: "action_uploadImage"
        });
        B.on("render", function(){
            var E = B.getEl();
            var F = new Ext.ux.form.BrowseButton({
                buttonCt: E,
                renderTo: E,
                scope: this,
                handler: function(G){
                    this.ctxMenu.hide();
                    this.onFileSelect(G)
                }
            })
        }, this);
        this.ctxMenu = new Ext.menu.Menu({
            items: [B, {
                text: "Edit Image",
                iconCls: "action_cropImage",
                scope: this,
                disabled: true,
                handler: function(){
                    var E = new Ext.ux.form.ImageCropper({
                        image: this.getValue()
                    });
                    E.show()
                }
            }, {
                text: "Delete Image",
                iconCls: "action_delete",
                disabled: this.imageSrc == this.defaultImage,
                scope: this,
                handler: function(){
                    this.setValue("")
                }
            }]
        });
        this.ctxMenu.showAt(D.getXY())
    },
    getImgTpl: function(){
        if (!this.imgTpl) {
            this.imgTpl = new Ext.XTemplate("<img ", 'src="{imageSrc}" ', 'width="{width}" ', 'height="{height -2}" ', 'style="border: 1px solid #B5B8C8;" ', " >").compile()
        }
        return this.imgTpl
    },
    updateImage: function(){
        var B = this.imageCt.up("div");
        var A = Ext.DomHelper.insertAfter(this.imageCt, this.getImgTpl().apply(this), true);
        A.on("load", function(){
            this.imageCt.remove();
            this.imageCt = A;
            this.buttonCt.unmask()
        }, this)
    }
});
Ext.namespace("Ext.ux.form");
Ext.ux.form.ImageCropper = function(A){
    Ext.apply(this, A);
    Ext.ux.form.ImageCropper.superclass.constructor.apply(this, arguments);
    this.addEvents("imagecropped")
};
Ext.extend(Ext.ux.form.ImageCropper, Ext.Window, {
    width: 320,
    height: 320,
    title: "Crop Image",
    layout: "fit",
    initComponent: function(){
        var A = new Tine.widgets.dialog.EditRecord({
            handlerScope: this,
            handlerCancle: this.close,
            items: [{
                xtype: "panel",
                html: '<img src="' + this.image + '" width="320" height="240">'
            }]
        });
        this.items = A;
        Ext.ux.form.ImageCropper.superclass.initComponent.call(this)
    }
});
Ext.namespace("Ext.ux.form");
Ext.ux.form.BrowseButton = Ext.extend(Ext.BoxComponent, {
    inputFileName: "file",
    debug: false,
    FLOAT_EL_WIDTH: 60,
    FLOAT_EL_HEIGHT: 18,
    buttonCt: null,
    clipEl: null,
    floatEl: null,
    inputFileEl: null,
    originalHandler: null,
    originalScope: null,
    initComponent: function(){
        Ext.ux.form.BrowseButton.superclass.initComponent.call(this);
        this.originalHandler = this.handler || null;
        this.originalScope = this.scope || window;
        this.handler = null;
        this.scope = null
    },
    onRender: function(C, A){
        Ext.ux.form.BrowseButton.superclass.onRender.call(this, C, A);
        this.buttonCt = this.buttonCt || this.el.child(".x-btn-center em");
        this.buttonCt.position("relative");
        var B = {
            position: "absolute",
            overflow: "hidden",
            top: "0px",
            left: "0px"
        };
        if (Ext.isIE) {
            Ext.apply(B, {
                left: "-3px",
                top: "-3px"
            })
        }
        else {
            if (Ext.isGecko) {
                Ext.apply(B, {
                    left: "-3px",
                    top: "-3px"
                })
            }
            else {
                if (Ext.isSafari) {
                    Ext.apply(B, {
                        left: "-4px",
                        top: "-2px"
                    })
                }
            }
        }
        this.clipEl = this.buttonCt.createChild({
            tag: "div",
            style: B
        });
        this.setClipSize();
        this.clipEl.on({
            mousemove: this.onButtonMouseMove,
            mouseover: this.onButtonMouseMove,
            scope: this
        });
        this.floatEl = this.clipEl.createChild({
            tag: "div",
            style: {
                position: "absolute",
                width: this.FLOAT_EL_WIDTH + "px",
                height: this.FLOAT_EL_HEIGHT + "px",
                overflow: "hidden"
            }
        });
        if (this.debug) {
            this.clipEl.applyStyles({
                "background-color": "green"
            });
            this.floatEl.applyStyles({
                "background-color": "red"
            })
        }
        else {
            this.clipEl.setOpacity(0)
        }
        this.createInputFile()
    },
    setClipSize: function(){
        if (this.clipEl) {
            var B = this.buttonCt.getWidth();
            var A = this.buttonCt.getHeight();
            if (Ext.isIE) {
                B = B + 5;
                A = A + 5
            }
            else {
                if (Ext.isGecko) {
                    B = B + 6;
                    A = A + 6
                }
                else {
                    if (Ext.isSafari) {
                        B = B + 6;
                        A = A + 6
                    }
                }
            }
            this.clipEl.setSize(B, A)
        }
    },
    createInputFile: function(){
        this.inputFileEl = this.floatEl.createChild({
            tag: "input",
            type: "file",
            size: 1,
            name: this.inputFileName || Ext.id(this.el),
            style: {
                position: "absolute",
                cursor: "pointer",
                right: "0px",
                top: "0px"
            }
        });
        this.inputFileEl = this.inputFileEl.child("input") || this.inputFileEl;
        this.inputFileEl.on({
            click: this.onInputFileClick,
            change: this.onInputFileChange,
            scope: this
        });
        if (this.tooltip) {
            if (typeof this.tooltip == "object") {
                Ext.QuickTips.register(Ext.apply({
                    target: this.inputFileEl
                }, this.tooltip))
            }
            else {
                this.inputFileEl.dom[this.tooltipType] = this.tooltip
            }
        }
    },
    onButtonMouseMove: function(B){
        var A = B.getXY();
        A[0] -= this.FLOAT_EL_WIDTH / 2;
        A[1] -= this.FLOAT_EL_HEIGHT / 2;
        this.floatEl.setXY(A)
    },
    onInputFileClick: function(A){
        A.stopPropagation()
    },
    onInputFileChange: function(){
        if (this.originalHandler) {
            this.originalHandler.call(this.originalScope, this)
        }
    },
    detachInputFile: function(B){
        var A = this.inputFileEl;
        if (typeof this.tooltip == "object") {
            Ext.QuickTips.unregister(this.inputFileEl)
        }
        else {
            this.inputFileEl.dom[this.tooltipType] = null
        }
        this.inputFileEl.removeAllListeners();
        this.inputFileEl = null;
        if (!B) {
            this.createInputFile()
        }
        return A
    },
    getInputFile: function(){
        return this.inputFileEl
    },
    disable: function(){
        Ext.ux.form.BrowseButton.superclass.disable.call(this);
        this.inputFileEl.dom.disabled = true
    },
    enable: function(){
        Ext.ux.form.BrowseButton.superclass.enable.call(this);
        this.inputFileEl.dom.disabled = false
    }
});
Ext.reg("browsebutton", Ext.ux.form.BrowseButton);
Ext.namespace("Ext.ux", "Ext.ux.layout");
Ext.ux.layout.HorizontalFitLayout = Ext.extend(Ext.layout.ContainerLayout, {
    containsScrollbar: false,
    monitorResize: true,
    onLayout: function(B, C){
        Ext.layout.FitLayout.superclass.onLayout.call(this, B, C);
        if (!this.container.collapsed) {
            var A = C.getStyleSize();
            A.width = B.containsScrollbar ? A.width - 16 : A.width;
            B.items.each(function(D){
                this.setItemSize(D, A)
            }, this)
        }
    },
    setItemSize: function(B, A){
        if (B && A.height > 0) {
            B.setWidth(A.width)
        }
    }
});
Ext.Container.LAYOUTS.hfit = Ext.ux.layout.HorizontalFitLayout;
Ext.namespace("Ext.ux");
Date.prototype.getFirstDateOfWeek = function(){
    var A = this.clearTime();
    var B = this.getWeekOfYear();
    while (B == A.getWeekOfYear()) {
        A = A.add(Date.DAY, -1)
    }
    A = A.add(Date.DAY, 1);
    return A
};
Ext.ux.DatePickerRange = Ext.extend(Ext.DatePicker, {
    selectionMode: "month",
    setSelectionMode: function(A){
        this.selectionMode = A;
        this.setValue(this.value)
    },
    getSelectionMode: function(){
        return this.selectionMode()
    },
    update: function(W){
        var A = this.activeDate;
        this.activeDate = W;
        if (A && this.el) {
            var I = W.getTime();
            if (A.getMonth() == W.getMonth() && A.getFullYear() == W.getFullYear()) {
                this.cells.removeClass("x-date-selected");
                this.cells.each(function(a){
                    if (this.isSelected(a.dom.firstChild.dateValue)) {
                        a.addClass("x-date-selected")
                    }
                }, this);
                return
            }
        }
        var F = W.getDaysInMonth();
        var J = W.getFirstDateOfMonth();
        var C = J.getDay() - this.startDay;
        if (C <= this.startDay) {
            C += 7
        }
        var S = W.add("mo", -1);
        var D = S.getDaysInMonth() - C;
        var B = this.cells.elements;
        var K = this.textNodes;
        F += C;
        var P = 86400000;
        var U = (new Date(S.getFullYear(), S.getMonth(), D)).clearTime();
        var T = new Date().clearTime().getTime();
        var N = W.clearTime().getTime();
        var M = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
        var Q = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
        var X = this.disabledDatesRE;
        var L = this.disabledDatesText;
        var Z = this.disabledDays ? this.disabledDays.join("") : false;
        var V = this.disabledDaysText;
        var R = this.format;
        var G = function(e, a){
            a.title = "";
            var c = U.getTime();
            a.firstChild.dateValue = c;
            if (c == T) {
                a.className += " x-date-today";
                a.title = e.todayText
            }
            if (e.isSelected(a.firstChild.dateValue)) {
                a.className += " x-date-selected"
            }
            if (c < M) {
                a.className = " x-date-disabled";
                a.title = e.minText;
                return
            }
            if (c > Q) {
                a.className = " x-date-disabled";
                a.title = e.maxText;
                return
            }
            if (Z) {
                if (Z.indexOf(U.getDay()) != -1) {
                    a.title = V;
                    a.className = " x-date-disabled"
                }
            }
            if (X && R) {
                var d = U.dateFormat(R);
                if (X.test(d)) {
                    a.title = L.replace("%0", d);
                    a.className = " x-date-disabled"
                }
            }
        };
        var O = 0;
        for (; O < C; O++) {
            K[O].innerHTML = (++D);
            U.setDate(U.getDate() + 1);
            B[O].className = "x-date-prevday";
            G(this, B[O])
        }
        for (; O < F; O++) {
            intDay = O - C + 1;
            K[O].innerHTML = (intDay);
            U.setDate(U.getDate() + 1);
            B[O].className = "x-date-active";
            G(this, B[O])
        }
        var Y = 0;
        for (; O < 42; O++) {
            K[O].innerHTML = (++Y);
            U.setDate(U.getDate() + 1);
            B[O].className = "x-date-nextday";
            G(this, B[O])
        }
        this.mbtn.setText(this.monthNames[W.getMonth()] + " " + W.getFullYear());
        if (!this.internalRender) {
            var E = this.el.dom.firstChild;
            var H = E.offsetWidth;
            this.el.setWidth(H + this.el.getBorderWidth("lr"));
            Ext.fly(E).setWidth(H);
            this.internalRender = true;
            if (Ext.isOpera && !this.secondPass) {
                E.rows[0].cells[1].style.width = (H - (E.rows[0].cells[0].offsetWidth + E.rows[0].cells[2].offsetWidth)) + "px";
                this.secondPass = true;
                this.update.defer(10, this, [W])
            }
        }
    },
    isSelected: function(A){
        A = new Date(A);
        switch (this.selectionMode) {
            case "day":
                return A.clearTime().getTime() == this.value.clearTime().getTime();
                break;
            case "month":
                return A.getFirstDateOfMonth().clearTime().getTime() == this.value.getFirstDateOfMonth().clearTime().getTime();
                break;
            case "week":
                return A.getFirstDateOfWeek().clearTime().getTime() == this.value.getFirstDateOfWeek().clearTime().getTime();
                break;
            default:
                throw "Illegal selection mode";
                break
        }
    }
});
Ext.reg("datepickerrange", Ext.ux.DatePickerRange);
Ext.namespace("Tine.widgets");
Ext.namespace("Tine.widgets.dialog");
Tine.widgets.dialog.EditRecord = Ext.extend(Ext.FormPanel, {
    tbarItems: false,
    handlerScope: null,
    bodyStyle: "padding:5px",
    anchor: "100% 100%",
    region: "center",
    deferredRender: false,
    buttonAlign: "right",
    initComponent: function(){
        this.addEvents("cancle", "saveAndClose", "apply");
        this.action_saveAndClose = new Ext.Action({
            text: "Ok",
            minWidth: 70,
            handler: this.handlerSaveAndClose,
            iconCls: "action_saveAndClose",
            scope: this.handlerScope
        });
        this.action_applyChanges = new Ext.Action({
            text: "Apply",
            minWidth: 70,
            handler: this.handlerApplyChanges,
            iconCls: "action_applyChanges",
            scope: this.handlerScope
        });
        this.action_delete = new Ext.Action({
            text: "delete",
            minWidth: 70,
            handler: this.handlerDelete,
            iconCls: "action_delete",
            scope: this.handlerScope,
            disabled: true
        });
        this.action_cancel = new Ext.Action({
            text: "Cancel",
            minWidth: 70,
            handler: this.handlerCancle ? this.handlerCancle : function(){
                window.close()
            },
            iconCls: "action_cancel",
            scope: this.handlerScope
        });
        var A = [this.action_delete];
        this.buttons = [this.action_applyChanges, this.action_cancel, this.action_saveAndClose];
        if (this.tbarItems) {
            this.tbar = new Ext.Toolbar({
                id: "applicationToolbar",
                items: this.tbarItems
            })
        }
        Tine.widgets.dialog.EditRecord.superclass.initComponent.call(this)
    },
    getToolbar: function(){
        return this.getTopToolbar()
    },
    onCancel: function(){
        this.fireEvent("cancle")
    },
    onSaveAndClose: function(){
        this.fireEvent("saveAndClose")
    },
    onApply: function(){
        this.fireEvent("apply")
    }
});
Ext.namespace("Tine.widgets.Priority");
Tine.widgets.Priority.store = new Ext.data.SimpleStore({
    storeId: "Priorities",
    id: "key",
    fields: ["key", "value", "icon"],
    data: [["0", "low", ""], ["1", "normal", ""], ["2", "high", ""], ["3", "urgent", ""]]
});
Tine.widgets.Priority.Combo = Ext.extend(Ext.form.ComboBox, {
    autoExpand: false,
    blurOnSelect: false,
    displayField: "value",
    valueField: "key",
    mode: "local",
    triggerAction: "all",
    editable: false,
    lazyInit: false,
    initComponent: function(){
        Tine.widgets.Priority.Combo.superclass.initComponent.call(this);
        if (!this.value) {
            this.value = 1
        }
        this.store = Tine.widgets.Priority.store;
        if (this.autoExpand) {
            this.on("focus", function(){
                this.lazyInit = false;
                this.expand()
            })
        }
        if (this.blurOnSelect) {
            this.on("select", function(){
                this.fireEvent("blur", this)
            }, this)
        }
    }
});
Tine.widgets.Priority.renderer = function(B){
    var C = Tine.widgets.Priority.store;
    var A = C.find("key", B);
    return A !== undefined ? C.getAt(A).data.value : B
};
Ext.namespace("Tine.widgets");
Tine.widgets.AccountpickerField = Ext.extend(Ext.form.TwinTriggerField, {
    selectOnFocus: true,
    allowBlank: true,
    editable: false,
    readOnly: true,
    triggerAction: "all",
    typeAhead: true,
    trigger1Class: "x-form-clear-trigger",
    hideTrigger1: true,
    accountId: null,
    initComponent: function(){
        Tine.widgets.AccountpickerField.superclass.initComponent.call(this);
        if (this.selectOnFocus) {
            this.on("focus", function(){
                return this.onTrigger2Click()
            })
        }
        this.onTrigger2Click = function(A){
            this.dlg = new Tine.widgets.AccountpickerDialog({
                TriggerField: this
            })
        };
        this.on("select", function(){
            this.triggers[0].show()
        })
    },
    getValue: function(){
        return this.accountId
    },
    onTrigger1Click: function(){
        this.accountId = null;
        this.setValue("");
        this.fireEvent("select", this, null, 0);
        this.triggers[0].hide()
    }
});
Tine.widgets.AccountpickerDialog = Ext.extend(Ext.Component, {
    TriggerField: null,
    title: "please select an account",
    account: false,
    initComponent: function(){
        Tine.widgets.container.selectionDialog.superclass.initComponent.call(this);
        var A = new Ext.Button({
            disabled: true,
            handler: this.handler_okbutton,
            text: "Ok",
            scope: this
        });
        this.window = new Ext.Window({
            title: this.title,
            modal: true,
            width: 320,
            height: 400,
            minWidth: 320,
            minHeight: 400,
            layout: "fit",
            plain: true,
            bodyStyle: "padding:5px;",
            buttons: [A],
            buttonAlign: "center"
        });
        this.accountPicker = new Tine.widgets.account.PickerPanel({
            buttons: this.buttons
        });
        this.accountPicker.on("accountdblclick", function(B){
            this.account = B;
            this.handler_okbutton()
        }, this);
        this.accountPicker.on("accountselectionchange", function(B){
            this.account = B;
            A.setDisabled(B ? false : true)
        }, this);
        this.window.add(this.accountPicker);
        this.window.show()
    },
    handler_okbutton: function(){
        this.TriggerField.accountId = this.account.data.accountId;
        this.TriggerField.setValue(this.account.data.accountDisplayName);
        this.TriggerField.fireEvent("select");
        this.window.hide()
    }
});
Tine.widgets.AccountpickerActiondialog = Ext.extend(Ext.Window, {
    userSelectionBottomToolBar: null,
    modal: true,
    layout: "border",
    width: 700,
    height: 450,
    closeAction: "hide",
    plain: true,
    initComponent: function(){
        this.userSelection = new Tine.widgets.account.PickerPanel({
            enableBbar: true,
            region: "west",
            split: true,
            bbar: this.userSelectionBottomToolBar,
            selectType: this.selectType,
            selectAction: function(){
            }
        });
        if (!this.items) {
            this.items = [];
            this.userSelection.region = "center"
        }
        this.items.push(this.userSelection);
        if (!this.buttons) {
            this.buttons = [{
                text: "Save",
                id: "AccountsActionSaveButton",
                disabled: true,
                scope: this,
                handler: this.handlers.accountsActionSave
            }, {
                text: "Apply",
                id: "AccountsActionApplyButton",
                disabled: true,
                scope: this,
                handler: this.handlers.accountsActionApply
            }, {
                text: "Close",
                scope: this,
                handler: function(){
                    this.close()
                }
            }]
        }
        Tine.widgets.AccountpickerActiondialog.superclass.initComponent.call(this)
    },
    getUserSelection: function(){
        return this.userSelection
    }
});
Ext.namespace("Tine.widgets", "Tine.widgets.account");
Tine.widgets.account.PickerPanel = Ext.extend(Ext.TabPanel, {
    selectType: "user",
    selectTypeDefault: "user",
    selectAction: false,
    multiSelect: false,
    enableBbar: false,
    bbar: null,
    activeTab: 0,
    defaults: {
        autoScroll: true
    },
    border: false,
    split: true,
    width: 300,
    collapsible: false,
    initComponent: function(){
        this.addEvents("accountdblclick", "accountselectionchange");
        this.actions = {
            addAccount: new Ext.Action({
                text: "add account",
                disabled: true,
                scope: this,
                handler: function(){
                    var C = this.searchPanel.getSelectionModel().getSelected();
                    this.fireEvent("accountdblclick", C)
                },
                iconCls: "action_addContact"
            })
        };
        this.ugStore = new Ext.data.SimpleStore({
            fields: Tine.Tinebase.Model.Account
        });
        this.ugStore.setDefaultSort("name", "asc");
        this.loadData = function(){
            var D = Ext.ButtonToggleMgr.getSelected("account_picker_panel_ugselect").accountType;
            var C = Ext.getCmp("Tinebase_Accounts_SearchField").getRawValue();
            if (this.requestParams && this.requestParams.filter == C && this.requestParams.accountType == D) {
                return
            }
            this.requestParams = {
                filter: C,
                accountType: D,
                dir: "asc",
                start: 0,
                limit: 50
            };
            Ext.getCmp("Tinebase_Accounts_Grid").getStore().removeAll();
            if (this.requestParams.filter.length < 1) {
                return
            }
            switch (D) {
                case "user":
                    this.requestParams.method = "Tinebase.getAccounts";
                    this.requestParams.sort = "accountDisplayName";
                    Ext.Ajax.request({
                        params: this.requestParams,
                        success: function(E, F){
                            var K = Ext.util.JSON.decode(E.responseText);
                            var J = [];
                            for (var H = 0; H < K.results.length; H++) {
                                var I = (K.results[H]);
                                J.push(new Tine.Tinebase.Model.Account({
                                    id: I.accountId,
                                    type: "user",
                                    name: I.accountDisplayName,
                                    data: I
                                }))
                            }
                            if (J.length > 0) {
                                var G = Ext.getCmp("Tinebase_Accounts_Grid");
                                G.getStore().add(J);
                                G.getSelectionModel().selectFirstRow();
                                G.getView().focusRow(0)
                            }
                        }
                    });
                    break;
                case "group":
                    this.requestParams.method = "Tinebase.getGroups";
                    this.requestParams.sort = "name";
                    Ext.Ajax.request({
                        params: this.requestParams,
                        success: function(E, F){
                            var K = Ext.util.JSON.decode(E.responseText);
                            var J = [];
                            for (var H = 0; H < K.results.length; H++) {
                                var I = (K.results[H]);
                                J.push(new Tine.Tinebase.Model.Account({
                                    id: I.id,
                                    type: "group",
                                    name: I.name,
                                    data: I
                                }))
                            }
                            if (J.length > 0) {
                                var G = Ext.getCmp("Tinebase_Accounts_Grid");
                                G.getStore().add(J);
                                G.getSelectionModel().selectFirstRow();
                                G.getView().focusRow(0)
                            }
                        }
                    });
                    break
            }
        };
        var B = new Ext.grid.ColumnModel([{
            resizable: false,
            sortable: false,
            id: "name",
            header: "Name",
            dataIndex: "name",
            width: 70
        }]);
        B.defaultSortable = true;
        this.quickSearchField = new Ext.ux.SearchField({
            id: "Tinebase_Accounts_SearchField",
            emptyText: "enter searchfilter"
        });
        this.quickSearchField.on("change", function(){
            this.loadData()
        }, this);
        var A = function(C){
        };
        this.Toolbar = new Ext.Toolbar({
            items: [{
                scope: this,
                hidden: this.selectType != "both",
                pressed: this.selectTypeDefault != "group",
                accountType: "user",
                iconCls: "action_selectUser",
                xtype: "tbbtnlockedtoggle",
                handler: this.loadData,
                enableToggle: true,
                toggleGroup: "account_picker_panel_ugselect"
            }, {
                scope: this,
                hidden: this.selectType != "both",
                pressed: this.selectTypeDefault == "group",
                iconCls: "action_selectGroup",
                accountType: "group",
                xtype: "tbbtnlockedtoggle",
                handler: this.loadData,
                enableToggle: true,
                toggleGroup: "account_picker_panel_ugselect"
            }, this.quickSearchField]
        });
        if (this.enableBbar && !this.bbar) {
            this.bbar = new Ext.Toolbar({
                items: [this.actions.addAccount]
            })
        }
        this.searchPanel = new Ext.grid.GridPanel({
            title: "Search",
            id: "Tinebase_Accounts_Grid",
            store: this.ugStore,
            cm: B,
            enableColumnHide: false,
            enableColumnMove: false,
            autoSizeColumns: false,
            selModel: new Ext.grid.RowSelectionModel({
                multiSelect: this.multiSelect
            }),
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "name",
            tbar: this.Toolbar,
            bbar: this.Toolbar2,
            border: false
        });
        this.searchPanel.on("rowdblclick", function(C, F, D){
            var E = this.searchPanel.getSelectionModel().getSelected();
            this.fireEvent("accountdblclick", E)
        }, this);
        this.searchPanel.on("keydown", function(C){
            if (C.getKey() == C.ENTER) {
                var D = this.searchPanel.getSelectionModel().getSelected();
                this.fireEvent("accountdblclick", D)
            }
        }, this);
        this.searchPanel.getSelectionModel().on("selectionchange", function(D){
            var C = D.getSelected();
            this.actions.addAccount.setDisabled(!C);
            this.fireEvent("accountselectionchange", C)
        }, this);
        this.items = [this.searchPanel, {
            title: "Browse",
            html: "Browse",
            disabled: true
        }];
        Tine.widgets.account.PickerPanel.superclass.initComponent.call(this);
        this.on("resize", function(){
            this.quickSearchField.setWidth(this.getSize().width - 3 - (this.selectType == "both" ? 44 : 0))
        }, this)
    }
});
Ext.namespace("Tine.widgets", "Tine.widgets.account");
Tine.widgets.account.ConfigGrid = Ext.extend(Ext.Panel, {
    accountPickerWidth: 200,
    accountPickerType: "user",
    accountPickerTypeDefault: "user",
    accountListTitle: "",
    configStore: null,
    hasAccountPrefix: false,
    configColumns: [],
    accountPicker: null,
    configGridPanel: null,
    layout: "border",
    border: false,
    initComponent: function(){
        this.recordPrefix = this.hasAccountPrefix ? "account_" : "";
        this.action_removeAccount = new Ext.Action({
            text: "remove account",
            disabled: true,
            scope: this,
            handler: this.removeAccount,
            iconCls: "action_deleteContact"
        });
        this.configStore.sort(this.recordPrefix + "name", "asc");
        this.accountPicker = new Tine.widgets.account.PickerPanel({
            selectType: this.accountPickerType,
            selectTypeDefault: this.accountPickerTypeDefault,
            enableBbar: true
        });
        this.accountPicker.on("accountdblclick", function(C){
            this.addAccount(C)
        }, this);
        var B = new Ext.grid.ColumnModel([{
            resizable: true,
            id: this.recordPrefix + "name",
            header: "Name",
            dataIndex: this.recordPrefix + "name",
            renderer: Tine.Tinebase.Common.accountRenderer,
            width: 70
        }].concat(this.configColumns));
        B.defaultSortable = true;
        var A = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        A.on("selectionchange", function(C){
            this.action_removeAccount.setDisabled(C.getCount() < 1)
        }, this);
        this.configGridPanel = new Ext.grid.EditorGridPanel({
            title: this.accountListTitle,
            store: this.configStore,
            cm: B,
            autoSizeColumns: false,
            selModel: A,
            enableColLock: false,
            loadMask: true,
            plugins: this.configColumns,
            autoExpandColumn: this.recordPrefix + "name",
            bbar: [this.action_removeAccount],
            border: false
        });
        this.items = this.getConfigGridLayout();
        Tine.widgets.account.ConfigGrid.superclass.initComponent.call(this);
        this.on("afterlayout", function(D){
            var C = D.ownerCt.getSize().height;
            this.setHeight(C);
            this.items.each(function(E){
                E.setHeight(C)
            })
        }, this)
    },
    getConfigGridLayout: function(){
        return [{
            layout: "fit",
            region: "west",
            border: false,
            split: true,
            width: this.accountPickerWidth,
            items: this.accountPicker
        }, {
            layout: "fit",
            region: "center",
            border: false,
            items: this.configGridPanel
        }]
    },
    addAccount: function(D){
        var B = this.getRecordIndex(D);
        if (B === false) {
            var A = {};
            A[this.recordPrefix + "name"] = D.data.name;
            A[this.recordPrefix + "type"] = D.data.type;
            A[this.recordPrefix + "id"] = D.data.id;
            var C = {};
            C[this.configStore.root] = [A];
            C[this.configStore.totalProperty] = 1;
            this.configStore.loadData(C, true)
        }
        this.configGridPanel.getSelectionModel().selectRow(this.getRecordIndex(D))
    },
    removeAccount: function(){
        var B = this.configGridPanel.getSelectionModel().getSelections();
        for (var A = 0; A < B.length; ++A) {
            this.configStore.remove(B[A])
        }
    },
    getRecordIndex: function(A){
        var B = false;
        this.configStore.each(function(C){
            if (C.data[this.recordPrefix + "type"] == "user" && A.data.type == "user" && C.data[this.recordPrefix + "id"] == A.data.id) {
                B = C.id
            }
            else {
                if (C.data[this.recordPrefix + "type"] == "group" && A.data.type == "group" && C.data[this.recordPrefix + "id"] == A.data.id) {
                    B = C.id
                }
            }
        }, this);
        return B ? this.configStore.indexOfId(B) : false
    }
});
Ext.namespace("Tine.widgets", "Tine.widgets.container");
Tine.widgets.container.selectionComboBox = Ext.extend(Ext.form.ComboBox, {
    defaultContainer: false,
    allowBlank: false,
    readOnly: true,
    container: null,
    initComponent: function(){
        Tine.widgets.container.selectionComboBox.superclass.initComponent.call(this);
        if (this.defaultContainer) {
            this.container = this.defaultContainer;
            this.value = this.defaultContainer.name
        }
        this.onTriggerClick = function(B){
            var A = new Tine.widgets.container.selectionDialog({
                TriggerField: this
            })
        }
    },
    getValue: function(){
        return this.container.id
    },
    setValue: function(A){
        this.container = A;
        this.setRawValue(A.name)
    }
});
Tine.widgets.container.selectionDialog = Ext.extend(Ext.Component, {
    title: "please select a container",
    initComponent: function(){
        Tine.widgets.container.selectionDialog.superclass.initComponent.call(this);
        var C = 400;
        if (Ext.getBody().getHeight(true) * 0.7 < C) {
            C = Ext.getBody().getHeight(true) * 0.7
        }
        var B = new Ext.Window({
            title: this.title,
            modal: true,
            width: 375,
            height: C,
            minWidth: 375,
            minHeight: C,
            layout: "fit",
            plain: true,
            bodyStyle: "padding:5px;",
            buttonAlign: "center"
        });
        var A = new Tine.widgets.container.TreePanel({
            itemName: this.TriggerField.itemName,
            appName: this.TriggerField.appName,
            defaultContainer: this.TriggerField.defaultContainer
        });
        A.on("click", function(D){
            if (D.attributes.containerType == "singleContainer") {
                this.TriggerField.setValue(D.attributes.container);
                B.hide()
            }
        }, this);
        B.add(A);
        B.show()
    }
});
Ext.namespace("Tine.widgets", "Tine.widgets.container");
Tine.widgets.container.grantDialog = Ext.extend(Tine.widgets.AccountpickerActiondialog, {
    grantContainer: null,
    folderName: "Folder",
    models: {
        containerGrant: Tine.Tinebase.Model.Grant
    },
    selectType: "both",
    id: "ContainerGrantsDialog",
    handlers: {
        removeAccount: function(E, B){
            var D = this.GrantsGridPanel.getSelectionModel().getSelections();
            var A = this.dataStore;
            for (var C = 0; C < D.length; ++C) {
                A.remove(D[C])
            }
            Ext.getCmp("AccountsActionSaveButton").enable();
            Ext.getCmp("AccountsActionApplyButton").enable()
        },
        addAccount: function(F){
            var E = Ext.getCmp("ContainerGrantsDialog");
            var C = E.dataStore;
            var D = E.GrantsGridPanel.getSelectionModel();
            var B = E.getRecordIndex(F);
            if (B === false) {
                var A = new E.models.containerGrant({
                    id: null,
                    accountId: F.data.data,
                    accountType: F.data.type,
                    readGrant: true,
                    addGrant: false,
                    editGrant: false,
                    deleteGrant: false,
                    adminGrant: false
                });
                C.addSorted(A);
                Ext.getCmp("AccountsActionSaveButton").enable();
                Ext.getCmp("AccountsActionApplyButton").enable()
            }
            D.selectRow(E.getRecordIndex(F))
        },
        accountsActionApply: function(D, G, F){
            var E = Ext.getCmp("ContainerGrantsDialog");
            if (E.grantContainer) {
                var C = E.grantContainer;
                Ext.MessageBox.wait("Please wait", "Updateing Grants");
                var B = [];
                var A = E.dataStore;
                A.each(function(I){
                    var H = new Tine.Tinebase.Model.Grant(I.data);
                    H.data.accountId = I.data.accountType == "group" ? I.data.accountId.id : I.data.accountId.accountId;
                    B.push(H.data)
                });
                Ext.Ajax.request({
                    params: {
                        method: "Tinebase_Container.setContainerGrants",
                        containerId: C.id,
                        grants: Ext.util.JSON.encode(B)
                    },
                    success: function(J, I){
                        var H = Ext.util.JSON.decode(J.responseText);
                        A.loadData(H, false);
                        Ext.MessageBox.hide();
                        if (F) {
                            E.close()
                        }
                    }
                });
                Ext.getCmp("AccountsActionSaveButton").disable();
                Ext.getCmp("AccountsActionApplyButton").disable()
            }
        },
        accountsActionSave: function(A, C){
            var B = Ext.getCmp("ContainerGrantsDialog");
            B.handlers.accountsActionApply(A, C, true)
        }
    },
    initComponent: function(){
        this.title = "Manage permissions for " + this.folderName + ': "' + Ext.util.Format.htmlEncode(this.grantContainer.name) + '"';
        this.actions = {
            addAccount: new Ext.Action({
                text: "add account",
                disabled: true,
                scope: this,
                handler: this.handlers.addAccount,
                iconCls: "action_addContact"
            }),
            removeAccount: new Ext.Action({
                text: "remove account",
                disabled: true,
                scope: this,
                handler: this.handlers.removeAccount,
                iconCls: "action_deleteContact"
            })
        };
        this.dataStore = new Ext.data.JsonStore({
            baseParams: {
                method: "Tinebase_Container.getContainerGrants",
                containerId: this.grantContainer.id
            },
            root: "results",
            totalProperty: "totalcount",
            fields: this.models.containerGrant
        });
        Ext.StoreMgr.add("ContainerGrantsStore", this.dataStore);
        this.dataStore.load();
        this.dataStore.on("update", function(E){
            Ext.getCmp("AccountsActionSaveButton").enable();
            Ext.getCmp("AccountsActionApplyButton").enable()
        }, this);
        var B = [new Ext.ux.grid.CheckColumn({
            header: "Read",
            dataIndex: "readGrant",
            width: 55
        }), new Ext.ux.grid.CheckColumn({
            header: "Add",
            dataIndex: "addGrant",
            width: 55
        }), new Ext.ux.grid.CheckColumn({
            header: "Edit",
            dataIndex: "editGrant",
            width: 55
        }), new Ext.ux.grid.CheckColumn({
            header: "Delete",
            dataIndex: "deleteGrant",
            width: 55
        })];
        if (this.grantContainer.type == "shared") {
            B.push(new Ext.ux.grid.CheckColumn({
                header: "Admin",
                dataIndex: "adminGrant",
                width: 55
            }))
        }
        var D = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "accountId",
            header: "Name",
            dataIndex: "accountId",
            renderer: Tine.Tinebase.Common.accountRenderer,
            width: 70
        }].concat(B));
        D.defaultSortable = true;
        var C = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        var A = new Ext.Toolbar({
            items: [this.actions.removeAccount]
        });
        C.on("selectionchange", function(F){
            var E = F.getCount();
            if (E < 1) {
                this.actions.removeAccount.setDisabled(true)
            }
            else {
                this.actions.removeAccount.setDisabled(false)
            }
        }, this);
        this.GrantsGridPanel = new Ext.grid.EditorGridPanel({
            region: "center",
            title: "Permissions",
            store: this.dataStore,
            cm: D,
            autoSizeColumns: false,
            selModel: C,
            enableColLock: false,
            loadMask: true,
            plugins: B,
            autoExpandColumn: "accountId",
            bbar: A,
            border: false
        });
        this.items = [this.GrantsGridPanel];
        Tine.widgets.container.grantDialog.superclass.initComponent.call(this)
    },
    onRender: function(B, A){
        Tine.widgets.container.grantDialog.superclass.onRender.call(this, B, A);
        this.getUserSelection().on("accountdblclick", function(C){
            this.handlers.addAccount(C)
        }, this)
    },
    getRecordIndex: function(C){
        var B = Ext.getCmp("ContainerGrantsDialog");
        var A = B.dataStore;
        var D = false;
        A.each(function(E){
            if ((E.data.accountType == "user" || E.data.accountType == "account") && C.data.type == "user" && E.data.accountId.accountId == C.data.id) {
                D = E.id
            }
            else {
                if (E.data.accountType == "group" && C.data.type == "group" && E.data.accountId.id == C.data.id) {
                    D = E.id
                }
            }
        });
        return D ? A.indexOfId(D) : false
    }
});
Ext.namespace("Tine.widgets", "Tine.widgets.container");
Tine.widgets.container.TreePanel = Ext.extend(Ext.tree.TreePanel, {
    appName: "",
    itemName: "item",
    folderName: "folder",
    extraItems: null,
    iconCls: "x-new-application",
    rootVisible: false,
    border: false,
    ctxNode: null,
    initComponent: function(){
        var D = new Locale.Gettext();
        D.textdomain("Tinebase");
        Tine.widgets.container.TreePanel.superclass.initComponent.call(this);
        this.addEvents("containeradd", "containerdelete", "containerrename", "containerpermissionchange");
        var A = new Ext.tree.TreeNode({
            text: "root",
            draggable: false,
            allowDrop: false,
            id: "root"
        });
        var C = [{
            text: D._("All") + " " + this.itemName,
            cls: "treemain",
            containerType: "all",
            id: "all",
            children: [{
                text: D._("My") + " " + this.itemName,
                cls: "file",
                containerType: Tine.Tinebase.container.TYPE_PERSONAL,
                id: "user",
                leaf: null,
                owner: Tine.Tinebase.Registry.get("currentAccount")
            }, {
                text: D._("Shared") + " " + this.itemName,
                cls: "file",
                containerType: Tine.Tinebase.container.TYPE_SHARED,
                children: null,
                leaf: null,
                owner: null
            }, {
                text: D._("Other Users"),
                cls: "file",
                containerType: "otherUsers",
                children: null,
                leaf: null,
                owner: null
            }]
        }];
        if (this.extraItems !== null) {
            Ext.each(this.extraItems, function(E){
                C[0].children.push(E)
            })
        }
        this.loader = new Tine.widgets.container.TreeLoader({
            dataUrl: "index.php",
            baseParams: {
                jsonKey: Tine.Tinebase.Registry.get("jsonKey"),
                method: "Tinebase_Container.getContainer",
                application: this.appName,
                containerType: Tine.Tinebase.container.TYPE_PERSONAL
            }
        });
        this.loader.on("beforeload", function(E, F){
            E.baseParams.containerType = F.attributes.containerType;
            E.baseParams.owner = F.attributes.owner ? F.attributes.owner.accountId : null
        }, this);
        this.initContextMenu();
        this.on("contextmenu", function(H, G){
            this.ctxNode = H;
            var F = H.attributes.container;
            var E = H.attributes.owner;
            switch (H.attributes.containerType) {
                case "singleContainer":
                    if (F.account_grants.adminGrant) {
                        this.contextMenuSingleContainer.showAt(G.getXY())
                    }
                    break;
                case Tine.Tinebase.container.TYPE_PERSONAL:
                    if (E.accountId == Tine.Tinebase.Registry.get("currentAccount").accountId) {
                        this.contextMenuUserFolder.showAt(G.getXY())
                    }
                    break;
                case Tine.Tinebase.container.TYPE_SHARED:
                    if (Tine[this.appName].rights.indexOf("admin") > -1) {
                        this.contextMenuUserFolder.showAt(G.getXY())
                    }
                    break
            }
        }, this);
        this.setRootNode(A);
        for (var B = 0; B < C.length; B++) {
            A.appendChild(new Ext.tree.AsyncTreeNode(C[B]))
        }
    },
    afterRender: function(){
        Tine.widgets.container.TreePanel.superclass.afterRender.call(this);
        this.expandPath("/root/all");
        this.selectPath("/root/all")
    },
    initContextMenu: function(){
        var C = new Locale.Gettext();
        C.textdomain("Tinebase");
        var A = {
            addContainer: function(){
                Ext.MessageBox.prompt(C._("New") + " " + this.folderName, "Please enter the name of the new " + this.folderName + ":", function(E, F){
                    if (this.ctxNode && E == "ok") {
                        Ext.MessageBox.wait(C._("Please wait"), C._("Creating") + " " + this.folderName + "...");
                        var D = this.ctxNode;
                        Ext.Ajax.request({
                            params: {
                                method: "Tinebase_Container.addContainer",
                                application: this.appName,
                                containerName: F,
                                containerType: D.attributes.containerType
                            },
                            scope: this,
                            success: function(J, H){
                                var G = Ext.util.JSON.decode(J.responseText);
                                var I = this.loader.createNode(G);
                                D.appendChild(I);
                                this.fireEvent("containeradd", G);
                                Ext.MessageBox.hide()
                            }
                        })
                    }
                }, this)
            },
            deleteContainer: function(){
                if (this.ctxNode) {
                    var D = this.ctxNode;
                    Ext.MessageBox.confirm(C._("Confirm"), C._("Do you really want to delete the") + " " + this.folderName + ': "' + D.text + '"?', function(E){
                        if (E == "yes") {
                            Ext.MessageBox.wait(C._("Please wait"), C._("Deleting") + " " + this.folderName + ' "' + D.text + '"');
                            Ext.Ajax.request({
                                params: {
                                    method: "Tinebase_Container.deleteContainer",
                                    containerId: D.attributes.container.id
                                },
                                scope: this,
                                success: function(G, F){
                                    if (D.isSelected()) {
                                        this.getSelectionModel().select(D.parentNode);
                                        this.fireEvent("click", D.parentNode)
                                    }
                                    D.remove();
                                    this.fireEvent("containerdelete", D.attributes.container);
                                    Ext.MessageBox.hide()
                                }
                            })
                        }
                    }, this)
                }
            },
            renameContainer: function(){
                if (this.ctxNode) {
                    var D = this.ctxNode;
                    Ext.MessageBox.show({
                        title: "Rename " + this.folderName,
                        msg: C._("Please enter the new name of the") + " " + this.folderName + ":",
                        buttons: Ext.MessageBox.OKCANCEL,
                        value: D.text,
                        fn: function(E, F){
                            if (E == "ok") {
                                Ext.MessageBox.wait(C._("Please wait"), C._("Updateing") + " " + this.folderName + ' "' + D.text + '"');
                                Ext.Ajax.request({
                                    params: {
                                        method: "Tinebase_Container.renameContainer",
                                        containerId: D.attributes.container.id,
                                        newName: F
                                    },
                                    scope: this,
                                    success: function(I, H){
                                        var G = Ext.util.JSON.decode(I.responseText);
                                        D.setText(F);
                                        this.fireEvent("containerrename", G);
                                        Ext.MessageBox.hide()
                                    }
                                })
                            }
                        },
                        scope: this,
                        prompt: true,
                        icon: Ext.MessageBox.QUESTION
                    })
                }
            },
            managePermissions: function(){
                if (this.ctxNode) {
                    var D = this.ctxNode;
                    var E = new Tine.widgets.container.grantDialog({
                        folderName: this.folderName,
                        grantContainer: D.attributes.container
                    });
                    E.show()
                }
            }
        };
        var B = {
            addContainer: new Ext.Action({
                text: C._("Add") + " " + this.folderName,
                iconCls: "action_add",
                handler: A.addContainer,
                scope: this
            }),
            deleteContainer: new Ext.Action({
                text: C._("Delete") + " " + this.folderName,
                iconCls: "action_delete",
                handler: A.deleteContainer,
                scope: this
            }),
            renameContainer: new Ext.Action({
                text: C._("Rename") + " " + this.folderName,
                iconCls: "action_rename",
                handler: A.renameContainer,
                scope: this
            }),
            grantsContainer: new Ext.Action({
                text: C._("Manage permissions"),
                iconCls: "action_managePermissions",
                handler: A.managePermissions,
                scope: this
            })
        };
        this.contextMenuUserFolder = new Ext.menu.Menu({
            items: [B.addContainer]
        });
        this.contextMenuSingleContainer = new Ext.menu.Menu({
            items: [B.deleteContainer, B.renameContainer, B.grantsContainer]
        })
    }
});
Tine.widgets.container.TreeLoader = Ext.extend(Ext.tree.TreeLoader, {
    createNode: function(attr){
        if (attr.name) {
            if (!attr.account_grants.accountId) {
                attr.account_grants = Ext.util.JSON.decode(attr.account_grants)
            }
            attr = {
                containerType: "singleContainer",
                container: attr,
                text: Ext.util.Format.htmlEncode(attr.name),
                cls: "file",
                leaf: true
            }
        }
        else {
            if (attr.accountDisplayName) {
                attr = {
                    containerType: Tine.Tinebase.container.TYPE_PERSONAL,
                    text: Ext.util.Format.htmlEncode(attr.accountDisplayName),
                    cls: "folder",
                    leaf: false,
                    owner: attr
                }
            }
        }
        if (this.baseAttrs) {
            Ext.applyIf(attr, this.baseAttrs)
        }
        if (this.applyLoader !== false) {
            attr.loader = this
        }
        if (typeof attr.uiProvider == "string") {
            attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider)
        }
        return (attr.leaf ? new Ext.tree.TreeNode(attr) : new Ext.tree.AsyncTreeNode(attr))
    }
});
Ext.namespace("Tine.widgets", "Tine.widgets.group");
Tine.widgets.group.selectionComboBox = Ext.extend(Ext.form.ComboBox, {
    gotJson: false,
    group: {
        id: 2,
        name: "Users"
    },
    mode: "local",
    triggerAction: "all",
    allowBlank: false,
    editable: false,
    initComponent: function(){
        this.store = new Ext.data.JsonStore({
            baseParams: {
                method: "Admin.getGroups",
                filter: "",
                sort: "name",
                dir: "asc",
                start: 0,
                limit: 50
            },
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Ext.data.Record.create([{
                name: "id"
            }, {
                name: "name"
            }])
        });
        Tine.widgets.group.selectionComboBox.superclass.initComponent.call(this, arguments);
        this.onTriggerClick = function(A){
            if (!this.gotJson) {
                this.store.load();
                this.gotJson = true
            }
            Tine.widgets.group.selectionComboBox.superclass.onTriggerClick.call(this, arguments)
        }
    },
    getValue: function(){
        return this.group.id
    },
    setValue: function(A){
        if (!this.gotJson) {
            this.setRawValue(A.name);
            this.group = A
        }
        else {
            var B = this.store.getById(A).data;
            this.setRawValue(B.name);
            this.group = B
        }
    }
});
Tine.widgets.group.selectionDialog = Ext.extend(Ext.Component, {
    title: "please select a group",
    initComponent: function(){
        Tine.widgets.group.selectionDialog.superclass.initComponent.call(this);
        var B = 400;
        if (Ext.getBody().getHeight(true) * 0.7 < B) {
            B = Ext.getBody().getHeight(true) * 0.7
        }
        var A = new Ext.Window({
            title: this.title,
            modal: true,
            width: 375,
            height: B,
            minWidth: 375,
            minHeight: B,
            layout: "fit",
            plain: true,
            bodyStyle: "padding:5px;",
            buttonAlign: "center",
            items: groupsGridPanel
        });
        A.show()
    }
});
Ext.namespace("Tine.Admin.Model");
Tine.Admin.Model.Group = Ext.data.Record.create([{
    name: "id"
}, {
    name: "name"
}, {
    name: "description"
}]);
Ext.namespace("Tine.widgets", "Tine.widgets.tags");
Tine.widgets.tags.TagPanel = Ext.extend(Ext.Panel, {
    app: "",
    recordId: "",
    tags: [],
    findGlobalTags: true,
    recordTagsStore: null,
    availableTagsStore: false,
    searchField: null,
    title: "Tags",
    iconCls: "action_tag",
    layout: "hfit",
    bodyStyle: "padding: 2px 2px 2px 2px",
    initComponent: function(){
        this.tags = [];
        this.recordTagsStore = new Ext.data.JsonStore({
            id: "id",
            fields: Tine.Tinebase.Model.Tag,
            data: this.tags
        });
        this.availableTagsStore = new Ext.data.JsonStore({
            id: "id",
            root: "results",
            totalProperty: "totalCount",
            fields: Tine.Tinebase.Model.Tag,
            baseParams: {
                method: "Tinebase.getTags",
                context: this.app,
                owner: Tine.Tinebase.Registry.get("currentAccount").accountId,
                findGlobalTags: this.findGlobalTags
            }
        });
        this.initSearchField();
        this.bbar = [this.searchField, "->", new Ext.Button({
            disabled: true,
            text: "List"
        })];
        var A = new Ext.XTemplate('<tpl for=".">', '<div class="x-widget-tag-tagitem" id="{id}">', '<div class="x-widget-tag-tagitem-color" style="background-color: {color};">&#160;</div>', '<div class="x-widget-tag-tagitem-text" ext:qtip="{[this.encode(values.name)]} <i>({type})</i><tpl if="description != null && description.length &gt; 1"><hr>{[this.encode(values.description)]}</tpl>" >', "&nbsp;{[this.encode(values.name)]}", "</div>", "</div>", "</tpl>", {
            encode: function(B){
                return Ext.util.Format.htmlEncode(B)
            }
        });
        this.dataView = new Ext.DataView({
            store: this.recordTagsStore,
            tpl: A,
            autoHeight: true,
            multiSelect: true,
            overClass: "x-widget-tag-tagitem-over",
            selectedClass: "x-widget-tag-tagitem-selected",
            itemSelector: "div.x-widget-tag-tagitem",
            emptyText: "No Tags to display"
        });
        this.dataView.on("contextmenu", function(H, F, E, D){
            if (!this.dataView.isSelected(F)) {
                this.dataView.clearSelections();
                this.dataView.select(F)
            }
            D.preventDefault();
            var C = this.dataView.getSelectedRecords();
            var B = "Tag" + (C.length > 1 ? "s" : "");
            var G = new Ext.menu.Menu({
                items: [new Ext.Action({
                    scope: this,
                    text: "Detach " + B,
                    iconCls: "x-widget-tag-action-detach",
                    handler: function(){
                        for (var J = 0, I = C.length; J < I; J++) {
                            this.recordTagsStore.remove(C[J])
                        }
                    }
                }), "-", {
                    text: "Edit " + B,
                    disabled: true,
                    menu: {
                        items: [new Ext.Action({
                            scope: this,
                            disabled: C.length > 1,
                            text: "Rename"
                        }), new Ext.Action({
                            text: "Edit Description",
                            disabled: C.length > 1
                        }), new Ext.Action({
                            text: "Change Color",
                            disabled: C.length > 1
                        })]
                    }
                }, new Ext.Action({
                    hidden: true,
                    scope: this,
                    text: "Delete " + B,
                    iconCls: "action_delete",
                    handler: function(){
                        var K = [];
                        for (var J = 0, I = C.length; J < I; J++) {
                            if (C[J].id.length > 20) {
                                K.push(C[J].id)
                            }
                        }
                        Ext.MessageBox.wait("Please wait a moment...", "Deleting " + B);
                        Ext.Ajax.request({
                            params: {
                                method: "Tinebase.deleteTags",
                                ids: Ext.util.JSON.encode(K)
                            },
                            success: function(O, M){
                                for (var N = 0, L = C.length; N < L; N++) {
                                    this.recordTagsStore.remove(C[N])
                                }
                                Ext.MessageBox.hide()
                            },
                            failure: function(L, M){
                                Ext.MessageBox.alert("Failed", "Could not delete Tag(s).")
                            },
                            scope: this
                        })
                    }
                })]
            });
            G.showAt(D.getXY())
        }, this);
        this.formField = {
            layout: "form",
            items: new Tine.widgets.tags.TagFormField({
                recordTagsStore: this.recordTagsStore
            })
        };
        this.items = [this.dataView, this.formField];
        Tine.widgets.tags.TagPanel.superclass.initComponent.call(this)
    },
    onRender: function(B, A){
        Tine.widgets.tags.TagPanel.superclass.onRender.call(this, B, A)
    },
    onResize: function(A, B){
        Tine.widgets.tags.TagPanel.superclass.onResize.call(this, A, B);
        if (this.searchField.rendered && A) {
            this.searchField.setWidth(A - 37)
        }
    },
    initSearchField: function(){
        this.searchField = new Ext.form.ComboBox({
            store: this.availableTagsStore,
            mode: "local",
            displayField: "name",
            typeAhead: true,
            emptyText: "Enter tag name",
            loadingText: "Searching...",
            typeAheadDelay: 10,
            minChars: 1,
            hideTrigger: true,
            expand: function(){
            }
        });
        this.searchField.on("focus", function(A){
            A.hasFocus = false;
            this.availableTagsStore.load({
                scope: this,
                callback: function(){
                    A.hasFocus = true
                }
            })
        }, this);
        this.searchField.on("select", function(B, A){
            if (this.recordTagsStore.getById(A.id) === undefined) {
                this.recordTagsStore.add(A)
            }
            B.emptyText = "";
            B.clearValue()
        }, this);
        this.searchField.on("specialkey", function(E, D){
            if (D.getKey() == D.ENTER) {
                var C = E.getValue();
                if (C.length < 3) {
                    Ext.Msg.show({
                        title: "Notice",
                        msg: "The minimum tag length is three.",
                        buttons: Ext.Msg.OK,
                        animEl: "elId",
                        icon: Ext.MessageBox.INFO
                    })
                }
                else {
                    var A = false;
                    this.recordTagsStore.each(function(F){
                        if (F.data.name == C) {
                            A = true
                        }
                    }, this);
                    if (!A) {
                        var B = false;
                        this.availableTagsStore.each(function(F){
                            if (F.data.name == C) {
                                B = F
                            }
                        }, this);
                        if (!B) {
                            B = new Tine.Tinebase.Model.Tag({
                                name: C,
                                description: "",
                                color: "#FFFFFF"
                            })
                        }
                        this.recordTagsStore.add(B)
                    }
                }
                E.emptyText = "";
                E.clearValue()
            }
        }, this);
        this.searchField.on("blur", function(A){
            A.emptyText = "Enter tag name";
            A.clearValue()
        }, this)
    }
});
Tine.widgets.tags.TagFormField = Ext.extend(Ext.form.Field, {
    recordTagsStore: null,
    name: "tags",
    hidden: true,
    labelSeparator: "",
    initComponent: function(){
        Tine.widgets.tags.TagFormField.superclass.initComponent.call(this)
    },
    getValue: function(){
        var A = [];
        this.recordTagsStore.each(function(B){
            if (B.id.length > 5) {
                A.push(B.id)
            }
            else {
                A.push(B.data)
            }
        });
        return Ext.util.JSON.encode(A)
    },
    setValue: function(A){
        this.recordTagsStore.loadData(A)
    }
});
Tine.widgets.tags.TagEditDialog = Ext.extend(Ext.Window, {
    width: 200,
    height: 300,
    layout: "fit",
    margins: "0px 5px 0px 5px",
    initComponent: function(){
        this.items = new Ext.form.FormPanel({
            defaults: {
                xtype: "textfield",
                anchor: "100%"
            },
            labelAlign: "top",
            items: [{
                name: "name",
                fieldLabel: "Name"
            }, {
                name: "description",
                fieldLabel: "Description"
            }, {
                name: "color",
                fieldLabel: "Color"
            }]
        });
        Tine.widgets.tags.TagEditDialog.superclass.initComponent.call(this)
    }
});
Tine.widgets.tags.EditDialog = Ext.extend(Ext.Window, {
    layout: "border",
    width: 640,
    heigh: 480,
    initComponent: function(){
        this.items = [{
            region: "west",
            split: true
        }, {
            region: "center",
            split: true
        }];
        Tine.widgets.tags.EditDialog.superclass.call(this)
    }
});
Ext.namespace("Tine.widgets", "Tine.widgets.tags");
Tine.widgets.tags.TagCombo = Ext.extend(Ext.ux.form.ClearableComboBox, {
    app: "",
    findGlobalTags: true,
    id: "TagCombo",
    emptyText: "tag name",
    typeAhead: true,
    editable: false,
    mode: "remote",
    triggerAction: "all",
    displayField: "name",
    valueField: "id",
    width: 100,
    initComponent: function(){
        this.store = new Ext.data.JsonStore({
            id: "id",
            root: "results",
            totalProperty: "totalCount",
            fields: Tine.Tinebase.Model.Tag,
            baseParams: {
                method: "Tinebase.getTags",
                context: this.app,
                owner: Tine.Tinebase.Registry.get("currentAccount").accountId,
                findGlobalTags: this.findGlobalTags
            }
        });
        Tine.widgets.tags.TagCombo.superclass.initComponent.call(this);
        this.on("select", function(){
            var A = this.getValue();
            if (String(A) !== String(this.startValue)) {
                this.fireEvent("change", this, A, this.startValue)
            }
        }, this)
    }
});
Ext.namespace("Tine.widgets");
Tine.widgets.CountryCombo = Ext.extend(Ext.form.ComboBox, {
    fieldLabel: "Country",
    displayField: "translatedName",
    valueField: "shortName",
    typeAhead: true,
    mode: "local",
    triggerAction: "all",
    emptyText: "Select a country...",
    selectOnFocus: true,
    initComponent: function(){
        this.store = this.getCountryStore();
        Tine.widgets.CountryCombo.superclass.initComponent.call(this);
        this.on("focus", function(A){
            if (this.getCountryStore().getCount() == 0) {
                A.hasFocus = false;
                this.getCountryStore().load({
                    scope: this,
                    callback: function(){
                        A.hasFocus = true
                    }
                })
            }
        }, this);
        this.on("select", function(A){
            A.selectText()
        }, this)
    },
    getCountryStore: function(){
        var A = Ext.StoreMgr.get("Countries");
        if (!A) {
            A = new Ext.data.JsonStore({
                baseParams: {
                    method: "Tinebase.getCountryList"
                },
                root: "results",
                id: "shortName",
                fields: ["shortName", "translatedName"],
                remoteSort: false
            });
            Ext.StoreMgr.add("Countries", A)
        }
        return A
    },
    onTriggerClick: function(){
        if (this.getCountryStore().getCount() == 0) {
            this.getCountryStore().load({
                scope: this,
                callback: function(){
                    Tine.widgets.CountryCombo.superclass.onTriggerClick.call(this)
                }
            })
        }
        else {
            Tine.widgets.CountryCombo.superclass.onTriggerClick.call(this)
        }
    }
});
Ext.reg("widget-countrycombo", Tine.widgets.CountryCombo);
Ext.namespace("Tine.Addressbook");
Tine.Addressbook = {
    getPanel: function(){
        var D = new Locale.Gettext();
        D.textdomain("Addressbook");
        var A = Tine.Tinebase.Registry.get("accountBackend");
        if (A == "Sql") {
            var B = {
                text: D._("Internal Contacts"),
                cls: "file",
                containerType: "internalContainer",
                id: "internal",
                children: [],
                leaf: false,
                expanded: true
            }
        }
        var C = new Tine.widgets.container.TreePanel({
            id: "Addressbook_Tree",
            iconCls: "AddressbookIconCls",
            title: D._("Addressbook"),
            itemName: D._("contacts"),
            folderName: "addressbook",
            appName: "Addressbook",
            border: false,
            extraItems: B ? B : []
        });
        C.on("click", function(F, E){
            Tine.Addressbook.Main.show(F)
        }, this);
        C.on("beforeexpand", function(E){
            E.fireEvent("click", E.getSelectionModel().getSelectedNode())
        }, this);
        return C
    }
};
Tine.Addressbook.Main = {
    actions: {
        addContact: null,
        editContact: null,
        deleteContact: null,
        exportContact: null,
        callContact: null
    },
    handlers: {
        addContact: function(B, A){
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=", 800, 600)
        },
        editContact: function(D, A){
            var C = Ext.getCmp("Addressbook_Contacts_Grid").getSelectionModel().getSelections();
            var B = C[0].id;
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=" + B, 800, 600)
        },
        exportContact: function(D, A){
            var C = Ext.getCmp("Addressbook_Contacts_Grid").getSelectionModel().getSelections();
            var B = C[0].id;
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.exportContact&_format=pdf&_contactId=" + B, 768, 1024)
        },
        callContact: function(D, B){
            var C;
            var A = Ext.getCmp("Addressbook_Contacts_Grid").getSelectionModel().getSelected();
            switch (D.getId()) {
                case "Addressbook_Contacts_CallContact_Work":
                    C = A.data.tel_work;
                    break;
                case "Addressbook_Contacts_CallContact_Home":
                    C = A.data.tel_home;
                    break;
                case "Addressbook_Contacts_CallContact_Cell":
                    C = A.data.tel_cell;
                    break;
                case "Addressbook_Contacts_CallContact_CellPrivate":
                    C = A.data.tel_cell_private;
                    break;
                default:
                    if (!Ext.isEmpty(A.data.tel_work)) {
                        C = A.data.tel_work
                    }
                    else {
                        if (!Ext.isEmpty(A.data.tel_cell)) {
                            C = A.data.tel_cell
                        }
                        else {
                            if (!Ext.isEmpty(A.data.tel_cell_private)) {
                                C = A.data.tel_cell_private
                            }
                            else {
                                if (!Ext.isEmpty(A.data.tel_home)) {
                                    C = A.data.tel_work
                                }
                            }
                        }
                    }
                    break
            }
            Ext.Ajax.request({
                url: "index.php",
                params: {
                    method: "Dialer.dialNumber",
                    number: C
                },
                success: function(F, E){
                },
                failure: function(E, F){
                }
            })
        },
        deleteContact: function(B, A){
            Ext.MessageBox.confirm("Confirm", "Do you really want to delete the selected contacts?", function(F){
                if (F == "yes") {
                    var D = [];
                    var E = Ext.getCmp("Addressbook_Contacts_Grid").getSelectionModel().getSelections();
                    for (var C = 0; C < E.length; ++C) {
                        D.push(E[C].id)
                    }
                    D = Ext.util.JSON.encode(D);
                    Ext.Ajax.request({
                        url: "index.php",
                        params: {
                            method: "Addressbook.deleteContacts",
                            _contactIds: D
                        },
                        text: "Deleting contact(s)...",
                        success: function(H, G){
                            Ext.getCmp("Addressbook_Contacts_Grid").getStore().reload()
                        },
                        failure: function(G, H){
                            Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the conctact.")
                        }
                    })
                }
            })
        }
    },
    renderer: {
        contactTid: function(D, F, C, A, B, E){
            return "<img src='images/oxygen/16x16/actions/user.png' width='12' height='12' alt='contact'/>"
        }
    },
    initComponent: function(){
        this.translation = new Locale.Gettext();
        this.translation.textdomain("Addressbook");
        this.actions.addContact = new Ext.Action({
            text: this.translation._("add contact"),
            handler: this.handlers.addContact,
            iconCls: "action_addContact",
            scope: this
        });
        this.actions.editContact = new Ext.Action({
            text: this.translation._("edit contact"),
            disabled: true,
            handler: this.handlers.editContact,
            iconCls: "action_edit",
            scope: this
        });
        this.actions.deleteContact = new Ext.Action({
            text: this.translation._("delete contact"),
            disabled: true,
            handler: this.handlers.deleteContact,
            iconCls: "action_delete",
            scope: this
        });
        this.actions.exportContact = new Ext.Action({
            text: this.translation._("export as pdf"),
            disabled: true,
            handler: this.handlers.exportContact,
            iconCls: "action_exportAsPdf",
            scope: this
        });
        this.actions.callContact = new Ext.Action({
            id: "Addressbook_Contacts_CallContact",
            text: this.translation._("call contact"),
            disabled: true,
            handler: this.handlers.callContact,
            iconCls: "DialerIconCls",
            menu: new Ext.menu.Menu({
                id: "Addressbook_Contacts_CallContact_Menu"
            }),
            scope: this
        })
    },
    updateMainToolbar: function(){
        var C = Ext.menu.MenuMgr.get("Tinebase_System_AdminMenu");
        C.removeAll();
        var B = Ext.getCmp("tineMenu").items.get("Tinebase_System_AdminButton");
        B.setIconClass("AddressbookTreePanel");
        B.setDisabled(true);
        var A = Ext.getCmp("tineMenu").items.get("Tinebase_System_PreferencesButton");
        A.setIconClass("AddressbookTreePanel");
        A.setDisabled(true)
    },
    displayContactsToolbar: function(){
        var D = function(E, G, F){
            if (G != F) {
                Ext.getCmp("Addressbook_Contacts_Grid").getStore().load({
                    params: {
                        start: 0,
                        limit: 50
                    }
                })
            }
        };
        var C = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 240
        });
        C.on("change", D, this);
        var A = new Tine.widgets.tags.TagCombo({
            app: "Addressbook",
            blurOnSelect: true
        });
        A.on("change", D, this);
        var B = new Ext.Toolbar({
            id: "Addressbook_Contacts_Toolbar",
            split: false,
            height: 26,
            items: [this.actions.addContact, this.actions.editContact, this.actions.deleteContact, "-", this.actions.exportContact, (Tine.Dialer && Tine.Dialer.rights && Tine.Dialer.rights.indexOf("run") > -1) ? new Ext.Toolbar.MenuButton(this.actions.callContact) : "", "->", this.translation._("Filter: "), A, this.translation._("Search: "), C]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(B)
    },
    displayContactsGrid: function(){
        var A = new Ext.data.JsonStore({
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Tine.Addressbook.Model.Contact,
            remoteSort: true
        });
        A.setDefaultSort("n_family", "asc");
        A.on("beforeload", function(F){
            F.baseParams.query = Ext.getCmp("quickSearchField").getRawValue();
            F.baseParams.tagFilter = Ext.getCmp("TagCombo").getValue()
        }, this);
        var E = new Ext.PagingToolbar({
            pageSize: 50,
            store: A,
            displayInfo: true,
            displayMsg: this.translation._("Displaying contacts {0} - {1} of {2}"),
            emptyMsg: this.translation._("No contacts to display")
        });
        var D = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "tid",
            header: this.translation._("Type"),
            dataIndex: "tid",
            width: 30,
            renderer: this.renderer.contactTid
        }, {
            resizable: true,
            id: "n_family",
            header: this.translation._("Last Name"),
            dataIndex: "n_family",
            hidden: true
        }, {
            resizable: true,
            id: "n_given",
            header: this.translation._("First Name"),
            dataIndex: "n_given",
            width: 80,
            hidden: true
        }, {
            resizable: true,
            id: "n_fn",
            header: this.translation._("Full Name"),
            dataIndex: "n_fn",
            hidden: true
        }, {
            resizable: true,
            id: "n_fileas",
            header: this.translation._("Display Name"),
            dataIndex: "n_fileas"
        }, {
            resizable: true,
            id: "org_name",
            header: this.translation._("Company"),
            dataIndex: "org_name",
            width: 200
        }, {
            resizable: true,
            id: "org_unit",
            header: this.translation._("Unit"),
            dataIndex: "org_unit",
            hidden: true
        }, {
            resizable: true,
            id: "title",
            header: this.translation._("Job Title"),
            dataIndex: "title",
            hidden: true
        }, {
            resizable: true,
            id: "role",
            header: this.translation._("Job Role"),
            dataIndex: "role",
            hidden: true
        }, {
            resizable: true,
            id: "room",
            header: this.translation._("Room"),
            dataIndex: "room",
            hidden: true
        }, {
            resizable: true,
            id: "adr_one_street",
            header: this.translation._("Street"),
            dataIndex: "adr_one_street",
            hidden: true
        }, {
            resizable: true,
            id: "adr_one_locality",
            header: this.translation._("City"),
            dataIndex: "adr_one_locality",
            width: 150,
            hidden: false
        }, {
            resizable: true,
            id: "adr_one_region",
            header: this.translation._("Region"),
            dataIndex: "adr_one_region",
            hidden: true
        }, {
            resizable: true,
            id: "adr_one_postalcode",
            header: this.translation._("Postalcode"),
            dataIndex: "adr_one_postalcode",
            hidden: true
        }, {
            resizable: true,
            id: "adr_one_countryname",
            header: this.translation._("Country"),
            dataIndex: "adr_one_countryname",
            hidden: true
        }, {
            resizable: true,
            id: "adr_two_street",
            header: this.translation._("Street (private)"),
            dataIndex: "adr_two_street",
            hidden: true
        }, {
            resizable: true,
            id: "adr_two_locality",
            header: this.translation._("City (private)"),
            dataIndex: "adr_two_locality",
            hidden: true
        }, {
            resizable: true,
            id: "adr_two_region",
            header: this.translation._("Region (private)"),
            dataIndex: "adr_two_region",
            hidden: true
        }, {
            resizable: true,
            id: "adr_two_postalcode",
            header: this.translation._("Postalcode (private)"),
            dataIndex: "adr_two_postalcode",
            hidden: true
        }, {
            resizable: true,
            id: "adr_two_countryname",
            header: this.translation._("Country (private)"),
            dataIndex: "adr_two_countryname",
            hidden: true
        }, {
            resizable: true,
            id: "email",
            header: this.translation._("Email"),
            dataIndex: "email",
            width: 150
        }, {
            resizable: true,
            id: "tel_work",
            header: this.translation._("Phone"),
            dataIndex: "tel_work",
            hidden: false
        }, {
            resizable: true,
            id: "tel_cell",
            header: this.translation._("Mobile"),
            dataIndex: "tel_cell",
            hidden: false
        }, {
            resizable: true,
            id: "tel_fax",
            header: this.translation._("Fax"),
            dataIndex: "tel_fax",
            hidden: true
        }, {
            resizable: true,
            id: "tel_car",
            header: this.translation._("Car phone"),
            dataIndex: "tel_car",
            hidden: true
        }, {
            resizable: true,
            id: "tel_pager",
            header: this.translation._("Pager"),
            dataIndex: "tel_pager",
            hidden: true
        }, {
            resizable: true,
            id: "tel_home",
            header: this.translation._("Phone (private)"),
            dataIndex: "tel_home",
            hidden: true
        }, {
            resizable: true,
            id: "tel_fax_home",
            header: this.translation._("Fax (private)"),
            dataIndex: "tel_fax_home",
            hidden: true
        }, {
            resizable: true,
            id: "tel_cell_private",
            header: this.translation._("Mobile (private)"),
            dataIndex: "tel_cell_private",
            hidden: true
        }, {
            resizable: true,
            id: "email_home",
            header: this.translation._("Email (private)"),
            dataIndex: "email_home",
            hidden: true
        }, {
            resizable: true,
            id: "url",
            header: this.translation._("Web"),
            dataIndex: "url",
            hidden: true
        }, {
            resizable: true,
            id: "url_home",
            header: this.translation._("URL (private)"),
            dataIndex: "url_home",
            hidden: true
        }, {
            resizable: true,
            id: "note",
            header: this.translation._("Note"),
            dataIndex: "note",
            hidden: true
        }, {
            resizable: true,
            id: "tz",
            header: this.translation._("Timezone"),
            dataIndex: "tz",
            hidden: true
        }, {
            resizable: true,
            id: "geo",
            header: this.translation._("Geo"),
            dataIndex: "geo",
            hidden: true
        }, {
            resizable: true,
            id: "bday",
            header: this.translation._("Birthday"),
            dataIndex: "bday",
            hidden: true
        }]);
        D.defaultSortable = true;
        var C = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        C.on("selectionchange", function(I){
            var G = I.getCount();
            if (G < 1) {
                this.actions.deleteContact.setDisabled(true);
                this.actions.editContact.setDisabled(true);
                this.actions.exportContact.setDisabled(true);
                this.actions.callContact.setDisabled(true)
            }
            else {
                if (G > 1) {
                    this.actions.deleteContact.setDisabled(false);
                    this.actions.editContact.setDisabled(true);
                    this.actions.exportContact.setDisabled(true);
                    this.actions.callContact.setDisabled(true)
                }
                else {
                    this.actions.deleteContact.setDisabled(false);
                    this.actions.editContact.setDisabled(false);
                    this.actions.exportContact.setDisabled(false);
                    if (Tine.Dialer && Tine.Dialer.rights && Tine.Dialer.rights.indexOf("run") > -1) {
                        var H = Ext.menu.MenuMgr.get("Addressbook_Contacts_CallContact_Menu");
                        H.removeAll();
                        var F = I.getSelected();
                        if (!Ext.isEmpty(F.data.tel_work)) {
                            H.add({
                                id: "Addressbook_Contacts_CallContact_Work",
                                text: "work " + F.data.tel_work + "",
                                handler: this.handlers.callContact
                            });
                            this.actions.callContact.setDisabled(false)
                        }
                        if (!Ext.isEmpty(F.data.tel_home)) {
                            H.add({
                                id: "Addressbook_Contacts_CallContact_Home",
                                text: "home " + F.data.tel_home + "",
                                handler: this.handlers.callContact
                            });
                            this.actions.callContact.setDisabled(false)
                        }
                        if (!Ext.isEmpty(F.data.tel_cell)) {
                            H.add({
                                id: "Addressbook_Contacts_CallContact_Cell",
                                text: "cell " + F.data.tel_cell + "",
                                handler: this.handlers.callContact
                            });
                            this.actions.callContact.setDisabled(false)
                        }
                        if (!Ext.isEmpty(F.data.tel_cell_private)) {
                            H.add({
                                id: "Addressbook_Contacts_CallContact_CellPrivate",
                                text: "cell private " + F.data.tel_cell_private + "",
                                handler: this.handlers.callContact
                            });
                            this.actions.callContact.setDisabled(false)
                        }
                    }
                }
            }
        }, this);
        var B = new Ext.grid.GridPanel({
            id: "Addressbook_Contacts_Grid",
            store: A,
            cm: D,
            tbar: E,
            autoSizeColumns: false,
            selModel: C,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "n_family",
            border: false,
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                emptyText: "No contacts to display"
            })
        });
        B.on("rowcontextmenu", function(G, F, I){
            I.stopEvent();
            if (!G.getSelectionModel().isSelected(F)) {
                G.getSelectionModel().selectRow(F)
            }
            var H = new Ext.menu.Menu({
                id: "ctxMenuContacts",
                items: [this.actions.editContact, this.actions.deleteContact, this.actions.exportContact, "-", this.actions.addContact]
            });
            H.showAt(I.getXY())
        }, this);
        B.on("rowdblclick", function(G, H, I){
            var F = G.getStore().getAt(H);
            try {
                Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=" + F.data.id, 800, 600)
            } 
            catch (J) {
            }
        }, this);
        B.on("keydown", function(F){
            if (F.getKey() == F.DELETE && Ext.getCmp("Addressbook_Contacts_Grid").getSelectionModel().getCount() > 0) {
                this.handlers.deleteContact()
            }
        }, this);
        Tine.Tinebase.MainScreen.setActiveContentPanel(B)
    },
    loadData: function(B){
        var A = Ext.getCmp("Addressbook_Contacts_Grid").getStore();
        switch (B.attributes.containerType) {
            case "internalContainer":
                A.baseParams.method = "Addressbook.getAccounts";
                break;
            case Tine.Tinebase.container.TYPE_SHARED:
                A.baseParams.method = "Addressbook.getSharedContacts";
                break;
            case "otherUsers":
                A.baseParams.method = "Addressbook.getOtherPeopleContacts";
                break;
            case "all":
                A.baseParams.method = "Addressbook.getAllContacts";
                break;
            case Tine.Tinebase.container.TYPE_PERSONAL:
                A.baseParams.method = "Addressbook.getContactsByOwner";
                A.baseParams.owner = B.attributes.owner.accountId;
                break;
            case "singleContainer":
                A.baseParams.method = "Addressbook.getContactsByAddressbookId";
                A.baseParams.addressbookId = B.attributes.container.id;
                break
        }
        A.load({
            params: {
                start: 0,
                limit: 50
            }
        })
    },
    show: function(A){
        var B = Tine.Tinebase.MainScreen.getActiveToolbar();
        if (B === false || B.id != "Addressbook_Contacts_Toolbar") {
            this.initComponent();
            this.displayContactsToolbar();
            this.displayContactsGrid();
            this.updateMainToolbar()
        }
        this.loadData(A)
    },
    reload: function(){
        if (Ext.ComponentMgr.all.containsKey("Addressbook_Contacts_Grid")) {
            setTimeout("Ext.getCmp('Addressbook_Contacts_Grid').getStore().reload()", 200)
        }
    }
};
Tine.Addressbook.ContactEditDialog = {
    handlers: {
        applyChanges: function(D, B, A){
            var C = Ext.getCmp("contactDialog").getForm();
            if (C.isValid()) {
                Ext.MessageBox.wait("Please wait a moment...", "Saving Contact");
                C.updateRecord(Tine.Addressbook.ContactEditDialog.contactRecord);
                Tine.Addressbook.ContactEditDialog.contactRecord.set("jpegphoto", Ext.getCmp("addressbookeditdialog-jpegimage").getValue());
                Ext.Ajax.request({
                    params: {
                        method: "Addressbook.saveContact",
                        contactData: Ext.util.JSON.encode(Tine.Addressbook.ContactEditDialog.contactRecord.data)
                    },
                    success: function(F, E){
                        if (window.opener.Tine.Addressbook) {
                            window.opener.Tine.Addressbook.Main.reload()
                        }
                        if (A === true) {
                            window.close()
                        }
                        else {
                            this.updateContactRecord(Ext.util.JSON.decode(F.responseText).updatedData);
                            C.loadRecord(this.contactRecord);
                            Ext.MessageBox.hide()
                        }
                    },
                    failure: function(E, F){
                        Ext.MessageBox.alert("Failed", "Could not save contact.")
                    },
                    scope: this
                })
            }
            else {
                Ext.MessageBox.alert("Errors", "Please fix the errors noted.")
            }
        },
        saveAndClose: function(B, A){
            this.handlers.applyChanges(B, A, true)
        },
        deleteContact: function(C, A){
            var B = Ext.util.JSON.encode([Tine.Addressbook.ContactEditDialog.contactRecord.data.id]);
            Ext.Ajax.request({
                url: "index.php",
                params: {
                    method: "Addressbook.deleteContacts",
                    _contactIds: B
                },
                text: "Deleting contact...",
                success: function(E, D){
                    if (window.opener.Tine.Addressbook) {
                        window.opener.Tine.Addressbook.Main.reload()
                    }
                    window.close()
                },
                failure: function(D, E){
                    Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the conctact.")
                }
            })
        },
        exportContact: function(C, A){
            var B = Ext.util.JSON.encode([formData.values.id])
        }
    },
    contactRecord: null,
    updateContactRecord: function(A){
        if (A.bday && A.bday !== null) {
            A.bday = Date.parseDate(A.bday, "c")
        }
        this.contactRecord = new Tine.Addressbook.Model.Contact(A)
    },
    updateToolbarButtons: function(_rights){
        with (_rights) {
            Ext.getCmp("contactDialog").action_saveAndClose.setDisabled(!editGrant);
            Ext.getCmp("contactDialog").action_applyChanges.setDisabled(!editGrant);
            Ext.getCmp("contactDialog").action_delete.setDisabled(!deleteGrant)
        }
    },
    display: function(D){
        var C = new Ext.Action({
            text: "export as pdf",
            handler: function(){
                var E = D.id;
                Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.exportContact&_format=pdf&_contactId=" + E, 200, 150)
            },
            iconCls: "action_exportAsPdf",
            disabled: false
        });
        var B = new Tine.widgets.dialog.EditRecord({
            layout: "hfit",
            id: "contactDialog",
            tbarItems: [C],
            handlerScope: this,
            handlerApplyChanges: this.handlers.applyChanges,
            handlerSaveAndClose: this.handlers.saveAndClose,
            handlerDelete: this.handlers.deleteContact,
            handlerExport: this.handlers.exportContact,
            items: Tine.Addressbook.ContactEditDialog.getEditForm()
        });
        B.on("render", function(E){
            E.getForm().findField("n_prefix").focus(false, 250)
        });
        var A = new Ext.Viewport({
            layout: "border",
            frame: true,
            items: B
        });
        this.updateContactRecord(D);
        this.updateToolbarButtons(D.grants);
        B.getForm().loadRecord(this.contactRecord);
        Ext.getCmp("addressbookeditdialog-jpegimage").setValue(this.contactRecord.get("jpegphoto"));
        if (this.contactRecord.data.adr_one_countrydisplayname) {
            B.getForm().findField("adr_one_countryname").setRawValue(this.contactRecord.data.adr_one_countrydisplayname)
        }
        if (this.contactRecord.data.adr_two_countrydisplayname) {
            B.getForm().findField("adr_two_countryname").setRawValue(this.contactRecord.data.adr_two_countrydisplayname)
        }
    }
};
Ext.namespace("Tine.Addressbook.Model");
Tine.Addressbook.Model.Contact = Ext.data.Record.create([{
    name: "id"
}, {
    name: "tid"
}, {
    name: "owner"
}, {
    name: "private"
}, {
    name: "cat_id"
}, {
    name: "n_family"
}, {
    name: "n_given"
}, {
    name: "n_middle"
}, {
    name: "n_prefix"
}, {
    name: "n_suffix"
}, {
    name: "n_fn"
}, {
    name: "n_fileas"
}, {
    name: "bday",
    type: "date",
    dateFormat: "c"
}, {
    name: "org_name"
}, {
    name: "org_unit"
}, {
    name: "title"
}, {
    name: "role"
}, {
    name: "assistent"
}, {
    name: "room"
}, {
    name: "adr_one_street"
}, {
    name: "adr_one_street2"
}, {
    name: "adr_one_locality"
}, {
    name: "adr_one_region"
}, {
    name: "adr_one_postalcode"
}, {
    name: "adr_one_countryname"
}, {
    name: "label"
}, {
    name: "adr_two_street"
}, {
    name: "adr_two_street2"
}, {
    name: "adr_two_locality"
}, {
    name: "adr_two_region"
}, {
    name: "adr_two_postalcode"
}, {
    name: "adr_two_countryname"
}, {
    name: "tel_work"
}, {
    name: "tel_cell"
}, {
    name: "tel_fax"
}, {
    name: "tel_assistent"
}, {
    name: "tel_car"
}, {
    name: "tel_pager"
}, {
    name: "tel_home"
}, {
    name: "tel_fax_home"
}, {
    name: "tel_cell_private"
}, {
    name: "tel_other"
}, {
    name: "tel_prefer"
}, {
    name: "email"
}, {
    name: "email_home"
}, {
    name: "url"
}, {
    name: "url_home"
}, {
    name: "freebusy_uri"
}, {
    name: "calendar_uri"
}, {
    name: "note"
}, {
    name: "tz"
}, {
    name: "geo"
}, {
    name: "pubkey"
}, {
    name: "created"
}, {
    name: "creator"
}, {
    name: "modified"
}, {
    name: "modifier"
}, {
    name: "jpegphoto"
}, {
    name: "account_id"
}, {
    name: "tags"
}]);
Tine.Addressbook.ContactEditDialog.getEditForm = function(){
    var A = new Locale.Gettext();
    A.textdomain("Addressbook");
    var H = {
        layout: "column",
        autoHeight: true,
        border: false,
        bodyStyle: "margin-top: 5px;",
        defaults: {
            border: false,
            layout: "form"
        },
        items: [{
            columnWidth: 0.5,
            layout: "column",
            border: false,
            items: [{
                layout: "form",
                labelWidth: 70,
                border: false,
                items: new Tine.widgets.container.selectionComboBox({
                    fieldLabel: A._("Saved in"),
                    width: 150,
                    name: "owner",
                    itemName: A._("contacts"),
                    appName: "Addressbook"
                })
            }]
        }, {
            columnWidth: 0.5,
            labelWidth: 150,
            items: {
                xtype: "combo",
                fieldLabel: A._("Display Name"),
                name: "n_fn",
                disabled: true,
                anchor: "100% r"
            }
        }]
    };
    var D = new Ext.ux.form.ColumnFormPanel({
        items: [[{
            columnWidth: 0.4,
            fieldLabel: A._("Job Role"),
            name: "role"
        }, {
            columnWidth: 0.4,
            fieldLabel: A._("Unit"),
            name: "org_unit"
        }, {
            columnWidth: 0.2,
            fieldLabel: A._("Room"),
            name: "room"
        }], [{
            columnWidth: 0.4,
            fieldLabel: A._("Middle Name"),
            name: "n_middle"
        }, {
            columnWidth: 0.4,
            fieldLabel: A._("Suffix"),
            name: "n_suffix"
        }, {
            columnWidth: 0.2,
            xtype: "datefield",
            fieldLabel: A._("Birthday"),
            name: "bday"
        }]]
    });
    var F = {
        title: A._("Personal Information"),
        xtype: "expanderfieldset",
        layout: "hfit",
        collapsible: true,
        autoHeight: true,
        items: [{
            layout: "column",
            items: [{
                columnWidth: 1,
                xtype: "columnform",
                items: [[{
                    columnWidth: 0.2,
                    fieldLabel: A._("Title"),
                    name: "n_prefix",
                    id: "n_prefix"
                }, {
                    columnWidth: 0.4,
                    fieldLabel: A._("First Name"),
                    name: "n_given"
                }, {
                    columnWidth: 0.4,
                    fieldLabel: A._("Last Name"),
                    name: "n_family"
                }], [{
                    columnWidth: 0.6,
                    xtype: "mirrortextfield",
                    fieldLabel: A._("Company"),
                    name: "org_name"
                }, {
                    columnWidth: 0.4,
                    fieldLabel: A._("Job Title"),
                    name: "title"
                }]]
            }, {
                hideLabels: true,
                width: 92,
                items: new Ext.ux.form.ImageField({
                    id: "addressbookeditdialog-jpegimage",
                    name: "jpegimage",
                    width: 90,
                    height: 80
                })
            }]
        }, D]
    };
    var C = {
        xtype: "columnform",
        labelAlign: "top",
        formDefaults: {
            xtype: "icontextfield",
            anchor: "100%",
            labelSeparator: "",
            columnWidth: 0.333
        },
        items: [[{
            fieldLabel: A._("Phone"),
            labelIcon: "images/oxygen/16x16/apps/kcall.png",
            name: "tel_work"
        }, {
            fieldLabel: A._("Mobile"),
            labelIcon: "images/oxygen/16x16/devices/phone.png",
            name: "tel_cell"
        }, {
            fieldLabel: A._("Fax"),
            labelIcon: "images/oxygen/16x16/devices/printer.png",
            name: "tel_fax"
        }], [{
            fieldLabel: A._("Phone (private)"),
            labelIcon: "images/oxygen/16x16/apps/kcall.png",
            name: "tel_home"
        }, {
            fieldLabel: A._("Mobile (private)"),
            labelIcon: "images/oxygen/16x16/devices/phone.png",
            name: "tel_cell_private"
        }, {
            fieldLabel: A._("Fax (private)"),
            labelIcon: "images/oxygen/16x16/devices/printer.png",
            name: "tel_fax_home"
        }], [{
            fieldLabel: A._("E-Mail"),
            labelIcon: "images/oxygen/16x16/actions/kontact-mail.png",
            name: "email",
            vtype: "email"
        }, {
            fieldLabel: A._("E-Mail (private)"),
            labelIcon: "images/oxygen/16x16/actions/kontact-mail.png",
            name: "email_home",
            vtype: "email"
        }, {
            xtype: "mirrortextfield",
            fieldLabel: A._("Web"),
            labelIcon: "images/oxygen/16x16/actions/network.png",
            name: "url",
            vtype: "url"
        }]]
    };
    var B = {
        title: A._("Contact Information"),
        xtype: "fieldset",
        layout: "hfit",
        autoHeight: true,
        items: [C]
    };
    var I = {
        xtype: "tabpanel",
        deferredRender: false,
        height: 160,
        activeTab: 0,
        border: false,
        defaults: {
            frame: true
        },
        items: [{
            xtype: "columnform",
            title: A._("Company Address"),
            labelAlign: "top",
            formDefaults: {
                xtype: "textfield",
                anchor: "100%",
                labelSeparator: "",
                columnWidth: 0.333
            },
            items: [[{
                fieldLabel: A._("Street"),
                name: "adr_one_street"
            }, {
                fieldLabel: A._("Street 2"),
                name: "adr_one_street2"
            }], [{
                fieldLabel: A._("Postal Code"),
                name: "adr_one_postalcode"
            }, {
                fieldLabel: A._("City"),
                name: "adr_one_locality"
            }, {
                fieldLabel: A._("Region"),
                name: "adr_one_region"
            }], [{
                xtype: "widget-countrycombo",
                fieldLabel: A._("Country"),
                name: "adr_one_countryname"
            }]]
        }, {
            xtype: "columnform",
            title: A._("Private Address"),
            labelAlign: "top",
            formDefaults: {
                xtype: "textfield",
                anchor: "100%",
                labelSeparator: "",
                columnWidth: 0.333
            },
            items: [[{
                fieldLabel: A._("Street"),
                name: "adr_two_street"
            }, {
                fieldLabel: A._("Street 2"),
                name: "adr_two_street2"
            }], [{
                fieldLabel: A._("Postal Code"),
                name: "adr_two_postalcode"
            }, {
                fieldLabel: A._("City"),
                name: "adr_two_locality"
            }, {
                fieldLabel: A._("Region"),
                name: "adr_two_region"
            }], [{
                xtype: "widget-countrycombo",
                fieldLabel: A._("Country"),
                name: "adr_two_countryname"
            }]]
        }, {
            title: A._("Custom Fields"),
            html: "",
            disabled: true
        }]
    };
    var G = {
        title: A._("Contact"),
        autoScroll: true,
        layout: "border",
        border: false,
        items: [{
            layout: "hfit",
            containsScrollbar: true,
            autoScroll: true,
            id: "adbEditDialogContactLeft",
            region: "center",
            items: [F, B, I]
        }, {
            layout: "hfit",
            region: "east",
            width: 200,
            split: true,
            collapsible: true,
            collapseMode: "mini",
            margins: "0 5 0 5",
            bodyStyle: "padding-left: 5px;",
            items: [new Tine.widgets.tags.TagPanel({
                height: 230,
                customHeight: 230,
                border: false,
                style: "border:1px solid #B5B8C8;"
            }), {
                xtype: "panel",
                layout: "form",
                labelAlign: "top",
                items: [{
                    labelSeparator: "",
                    xtype: "textarea",
                    name: "note",
                    fieldLabel: A._("Notes"),
                    grow: false,
                    preventScrollbars: false,
                    anchor: "100%",
                    height: 205
                }]
            }]
        }]
    };
    var E = new Ext.TabPanel({
        id: "adbEditDialogTabPanel",
        xtype: "tabpanel",
        defaults: {
            frame: true
        },
        height: 500,
        plain: true,
        activeTab: 0,
        border: false,
        items: [G, {
            title: sprintf(A.ngettext("Link", "Links [%d]", 1), 1),
            disabled: true
        }, {
            title: "Activity [5/+2]",
            disabled: true
        }, {
            title: A._("History"),
            disabled: true
        }]
    });
    E.on("bodyresize", function(K, J, L){
        K.setHeight(Ext.getCmp("contactDialog").getSize().height - 100)
    });
    return [E, H]
};
Ext.namespace("Tine.Crm");
Tine.Crm.getPanel = function(){
    var A = new Tine.widgets.container.TreePanel({
        id: "crmTree",
        iconCls: "CrmIconCls",
        title: "CRM",
        itemName: "Leads",
        folderName: "Leads",
        appName: "Crm",
        border: false
    });
    A.on("click", function(B){
        Tine.Crm.Main.show(B)
    }, this);
    A.on("beforeexpand", function(B){
        if (B.getSelectionModel().getSelectedNode() === null) {
            B.expandPath("/root/all");
            B.selectPath("/root/all")
        }
        B.fireEvent("click", B.getSelectionModel().getSelectedNode())
    }, this);
    return A
};
Tine.Crm.Main = function(){
    var G = new Locale.Gettext();
    G.textdomain("Crm");
    var C = {
        handlerEdit: function(){
            var H = Ext.getCmp("gridCrm").getSelectionModel().getSelections();
            Tine.Tinebase.Common.openWindow("leadWindow", "index.php?method=Crm.editLead&_leadId=" + H[0].id, 900, 700)
        },
        handlerDelete: function(){
            Ext.MessageBox.confirm("Confirm", G._("Are you sure you want to delete this lead?"), function(K){
                if (K == "yes") {
                    var H = Ext.getCmp("gridCrm").getSelectionModel().getSelections();
                    var L = [];
                    for (var I = 0; I < H.length; ++I) {
                        L.push(H[I].id)
                    }
                    var J = Ext.util.JSON.encode(L);
                    Ext.Ajax.request({
                        params: {
                            method: "Crm.deleteLeads",
                            _leadIds: J
                        },
                        text: G._("Deleting lead") + "...",
                        success: function(N, M){
                            Ext.getCmp("gridCrm").getStore().reload()
                        },
                        failure: function(M, N){
                            Ext.MessageBox.alert("Failed", G._("Some error occured while trying to delete the lead."))
                        }
                    })
                }
            })
        },
        exportLead: function(K, H){
            var J = Ext.getCmp("gridCrm").getSelectionModel().getSelections();
            var I = J[0].id;
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Crm.exportLead&_format=pdf&_leadId=" + I, 768, 1024)
        },
        handlerAddTask: function(){
            var H = Ext.getCmp("gridCrm").getSelectionModel().getSelections();
            popupWindow = new Tine.Tasks.EditPopup({
                relatedApp: "crm",
                relatedId: H[0].id
            })
        }
    };
    var E = {
        actionAdd: new Ext.Action({
            text: "Add lead",
            tooltip: "Add new lead",
            iconCls: "actionAdd",
            handler: function(){
                Tine.Tinebase.Common.openWindow("CrmLeadWindow", "index.php?method=Crm.editLead&_leadId=0&_eventId=NULL", 900, 700)
            }
        }),
        actionEdit: new Ext.Action({
            text: "Edit lead",
            tooltip: "Edit selected lead",
            disabled: true,
            handler: C.handlerEdit,
            iconCls: "actionEdit"
        }),
        actionDelete: new Ext.Action({
            text: "Delete lead",
            tooltip: "Delete selected leads",
            disabled: true,
            handler: C.handlerDelete,
            iconCls: "actionDelete"
        }),
        actionExport: new Ext.Action({
            text: "Export as PDF",
            tooltip: "Export selected lead as PDF",
            disabled: true,
            handler: C.exportLead,
            iconCls: "action_exportAsPdf",
            scope: this
        }),
        actionAddTask: new Ext.Action({
            text: "Add task",
            tooltip: "Add task for selected lead",
            handler: C.handlerAddTask,
            iconCls: "actionAddTask",
            disabled: true,
            scope: this
        })
    };
    var A = function(){
        var H = new Ext.data.JsonStore({
            baseParams: {
                method: "Crm.getLeadsByOwner",
                owner: "all"
            },
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Tine.Crm.Model.Lead,
            remoteSort: true
        });
        H.setDefaultSort("lead_name", "asc");
        H.on("beforeload", function(I){
            I.baseParams.filter = Ext.getCmp("quickSearchField").getRawValue();
            I.baseParams.leadstate = Ext.getCmp("filterLeadstate").getValue();
            I.baseParams.probability = Ext.getCmp("filterProbability").getValue();
            I.baseParams.getClosedLeads = Ext.getCmp("crmShowClosedLeadsButton").pressed
        });
        return H
    };
    var D = function(){
        for (var J in E) {
            if (!E[J].isTranlated) {
                E[J].setText(G._(E[J].initialConfig.text));
                E[J].initialConfig.tooltip = G._(E[J].initialConfig.tooltip);
                E[J].isTranslated = true
            }
        }
        var L = new Ext.data.SimpleStore({
            fields: ["key", "value"],
            data: [["0", "0 %"], ["10", "10 %"], ["20", "20 %"], ["30", "30 %"], ["40", "40 %"], ["50", "50 %"], ["60", "60 %"], ["70", "70 %"], ["80", "80 %"], ["90", "90 %"], ["100", "100 %"]]
        });
        var N = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 200,
            emptyText: G._("Enter searchfilter")
        });
        N.on("change", function(){
            Ext.getCmp("gridCrm").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        });
        var H = new Ext.ux.form.ClearableComboBox({
            fieldLabel: G._("Leadstate"),
            id: "filterLeadstate",
            name: "leadstate",
            hideLabel: true,
            width: 180,
            blankText: G._("Leadstate") + "...",
            hiddenName: "leadstate_id",
            store: Tine.Crm.LeadState.getStore(),
            displayField: "leadstate",
            valueField: "leadstate_id",
            typeAhead: true,
            mode: "remote",
            triggerAction: "all",
            emptyText: G._("leadstate") + "...",
            selectOnFocus: true,
            editable: false
        });
        H.on("select", function(R, P, Q){
            var O = "";
            if (P.data) {
                _leadstate = P.data.leadstate_id
            }
            Ext.getCmp("gridCrm").getStore().load({
                params: {
                    start: 0,
                    limit: 50,
                    leadstate: _leadstate,
                    probability: Ext.getCmp("filterProbability").getValue()
                }
            })
        });
        var I = new Ext.ux.form.ClearableComboBox({
            fieldLabel: G._("Probability"),
            id: "filterProbability",
            name: "probability",
            hideLabel: true,
            store: L,
            blankText: G._("Probability") + "...",
            displayField: "value",
            valueField: "key",
            typeAhead: true,
            mode: "local",
            triggerAction: "all",
            emptyText: G._("Probability") + "...",
            selectOnFocus: true,
            editable: false,
            renderer: Ext.util.Format.percentage,
            width: 90
        });
        I.on("select", function(R, O, P){
            var Q = "";
            if (O.data) {
                Q = O.data.key
            }
            Ext.getCmp("gridCrm").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        });
        var M = function(O){
            var P = Ext.getCmp("gridCrm").getView();
            var Q = Ext.getCmp("gridCrm").getColumnModel();
            if (O.pressed === true) {
                Q.setRenderer(1, function(S, T, R){
                    return "<b>" + S + "</b><br /><br />" + R.data.description
                });
                Q.setRenderer(2, Tine.Crm.Main.renderer.detailedContact);
                Q.setRenderer(3, Tine.Crm.Main.renderer.detailedContact);
                P.refresh()
            }
            else {
                Q.setRenderer(1, function(S, T, R){
                    return S
                });
                Q.setRenderer(2, Tine.Crm.Main.renderer.shortContact);
                Q.setRenderer(3, Tine.Crm.Main.renderer.shortContact);
                P.refresh()
            }
        };
        var K = new Ext.Toolbar({
            id: "crmToolbar",
            split: false,
            height: 26,
            items: [E.actionAdd, E.actionEdit, E.actionDelete, E.actionAddTask, E.actionExport, "->", new Ext.Button({
                tooltip: G._("Show details"),
                enableToggle: true,
                id: "crmShowDetailsButton",
                iconCls: "showDetailsAction",
                cls: "x-btn-icon",
                handler: M
            }), "-", new Ext.Button({
                tooltip: G._("Show closed leads"),
                enableToggle: true,
                iconCls: "showEndedLeadsAction",
                cls: "x-btn-icon",
                id: "crmShowClosedLeadsButton",
                handler: function(O){
                    Ext.getCmp("gridCrm").getStore().reload()
                }
            }), " ", H, " ", I, new Ext.Toolbar.Separator(), "->", " ", N]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(K)
    };
    var F = function(){
        var H = A();
        var M = new Ext.PagingToolbar({
            pageSize: 50,
            store: H,
            displayInfo: true,
            displayMsg: G._("Displaying leads {0} - {1} of {2}"),
            emptyMsg: G._("No leads found.")
        });
        var L = new Ext.menu.Menu({
            id: "ctxMenuGrid",
            items: [E.actionEdit, E.actionDelete, E.actionExport, E.actionAddTask]
        });
        var K = new Ext.grid.ColumnModel([{
            resizable: true,
            header: G._("Lead id"),
            id: "id",
            dataIndex: "id",
            width: 20,
            hidden: true
        }, {
            resizable: true,
            header: G._("Lead name"),
            id: "lead_name",
            dataIndex: "lead_name",
            width: 200
        }, {
            resizable: true,
            header: G._("Partner"),
            id: "lead_partner",
            dataIndex: "partner",
            width: 175,
            sortable: false,
            renderer: Tine.Crm.Main.renderer.shortContact
        }, {
            resizable: true,
            header: G._("Customer"),
            id: "lead_customer",
            dataIndex: "customer",
            width: 175,
            sortable: false,
            renderer: Tine.Crm.Main.renderer.shortContact
        }, {
            resizable: true,
            header: G._("Leadstate"),
            id: "leadstate",
            dataIndex: "leadstate",
            sortable: false,
            width: 100,
            renderer: function(N){
                return N.leadstate
            }
        }, {
            resizable: true,
            header: G._("Probability"),
            id: "probability",
            dataIndex: "probability",
            width: 50,
            renderer: Ext.util.Format.percentage
        }, {
            resizable: true,
            header: G._("Turnover"),
            id: "turnover",
            dataIndex: "turnover",
            width: 100,
            renderer: Ext.util.Format.euMoney
        }]);
        K.defaultSortable = true;
        var J = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        J.on("selectionchange", function(O){
            var N = O.getCount();
            if (N < 1) {
                E.actionDelete.setDisabled(true);
                E.actionEdit.setDisabled(true);
                E.actionExport.setDisabled(true);
                E.actionAddTask.setDisabled(true)
            }
            if (N == 1) {
                E.actionEdit.setDisabled(false);
                E.actionDelete.setDisabled(false);
                E.actionExport.setDisabled(false);
                E.actionAddTask.setDisabled(false)
            }
            if (N > 1) {
                E.actionEdit.setDisabled(true);
                E.actionExport.setDisabled(true);
                E.actionAddTask.setDisabled(true)
            }
        });
        var I = new Ext.grid.GridPanel({
            id: "gridCrm",
            store: H,
            cm: K,
            tbar: M,
            stripeRows: true,
            viewConfig: {
                forceFit: true
            },
            autoSizeColumns: false,
            selModel: J,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "lead_name",
            border: false,
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                emptyText: G._("No leads found.")
            })
        });
        Tine.Tinebase.MainScreen.setActiveContentPanel(I);
        I.on("rowcontextmenu", function(O, N, P){
            P.stopEvent();
            if (!O.getSelectionModel().isSelected(N)) {
                O.getSelectionModel().selectRow(N);
                E.action_delete.setDisabled(false)
            }
            L.showAt(P.getXY())
        });
        I.on("rowdblclick", function(P, O, Q){
            var N = P.getStore().getAt(O);
            Tine.Tinebase.Common.openWindow("leadWindow", "index.php?method=Crm.editLead&_leadId=" + N.data.id, 900, 700)
        });
        return
    };
    var B = function(I){
        var H = Ext.getCmp("gridCrm").getStore();
        switch (I.attributes.containerType) {
            case "shared":
                H.baseParams.method = "Crm.getSharedLeads";
                break;
            case "otherUsers":
                H.baseParams.method = "Crm.getOtherPeopleLeads";
                break;
            case "all":
                H.baseParams.method = "Crm.getAllLeads";
                break;
            case "personal":
                H.baseParams.method = "Crm.getLeadsByOwner";
                H.baseParams.owner = I.attributes.owner.accountId;
                break;
            case "singleContainer":
                H.baseParams.method = "Crm.getLeadsByFolder";
                H.baseParams.folderId = I.attributes.container.id;
                break
        }
        H.load({
            params: {
                start: 0,
                limit: 50
            }
        })
    };
    return {
        show: function(H){
            this.translation = new Locale.Gettext();
            this.translation.textdomain("Crm");
            var I = Tine.Tinebase.MainScreen.getActiveToolbar();
            if (I === false || I.id != "crmToolbar") {
                D();
                F();
                this.updateMainToolbar()
            }
            B(H)
        },
        updateMainToolbar: function(){
            var J = Ext.menu.MenuMgr.get("Tinebase_System_AdminMenu");
            J.removeAll();
            J.add({
                text: "leadstate",
                handler: Tine.Crm.LeadState.EditStatesDialog
            }, {
                text: "leadsource",
                handler: Tine.Crm.Main.handlers.editLeadSource
            }, {
                text: "leadtype",
                handler: Tine.Crm.Main.handlers.editLeadType
            }, {
                text: "product",
                handler: Tine.Crm.Main.handlers.editProductSource
            });
            var I = Ext.getCmp("tineMenu").items.get("Tinebase_System_AdminButton");
            I.setIconClass("crmThumbnailApplication");
            if (Tine.Crm.rights.indexOf("admin") > -1) {
                I.setDisabled(false)
            }
            else {
                I.setDisabled(true)
            }
            var H = Ext.getCmp("tineMenu").items.get("Tinebase_System_PreferencesButton");
            H.setIconClass("crmThumbnailApplication");
            I.setDisabled(false)
        },
        handlers: {
            editLeadSource: function(Q, K){
                var M = new Ext.Window({
                    title: "Leadsources",
                    id: "leadsourceWindow",
                    modal: true,
                    width: 350,
                    height: 500,
                    minWidth: 300,
                    minHeight: 500,
                    layout: "fit",
                    plain: true,
                    bodyStyle: "padding:5px;",
                    buttonAlign: "center"
                });
                var J = new Ext.data.JsonStore({
                    baseParams: {
                        method: "Crm.getLeadsources",
                        sort: "leadsource",
                        dir: "ASC"
                    },
                    root: "results",
                    totalProperty: "totalcount",
                    id: "leadsource_id",
                    fields: [{
                        name: "id"
                    }, {
                        name: "leadsource"
                    }],
                    remoteSort: false
                });
                J.load();
                var L = new Ext.grid.ColumnModel([{
                    id: "leadsource_id",
                    header: "id",
                    dataIndex: "leadsource_id",
                    width: 25,
                    hidden: true
                }, {
                    id: "leadsource",
                    header: "entries",
                    dataIndex: "leadsource",
                    width: 170,
                    hideable: false,
                    sortable: false,
                    editor: new Ext.form.TextField({
                        allowBlank: false
                    })
                }]);
                var O = Ext.data.Record.create([{
                    name: "leadsource_id",
                    type: "int"
                }, {
                    name: "leadsource",
                    type: "varchar"
                }]);
                var H = function(){
                    var R = new O({
                        leadsource_id: "NULL",
                        leadsource: ""
                    });
                    P.stopEditing();
                    J.insert(0, R);
                    P.startEditing(0, 0);
                    P.fireEvent("celldblclick", this, 0, 1)
                };
                var N = function(){
                    var R = Ext.getCmp("editLeadsourceGrid");
                    var S = R.getStore();
                    var U = R.getSelectionModel().getSelections();
                    for (var T = 0; T < U.length; ++T) {
                        S.remove(U[T])
                    }
                };
                var I = function(){
                    var S = Ext.getCmp("editLeadsourceGrid").getStore();
                    var R = Tine.Tinebase.Common.getJSONdata(S);
                    Ext.Ajax.request({
                        params: {
                            method: "Crm.saveLeadsources",
                            optionsData: R
                        },
                        text: "Saving leadsources...",
                        success: function(U, T){
                            S.reload();
                            S.rejectChanges()
                        },
                        failure: function(T, U){
                        }
                    })
                };
                var P = new Ext.grid.EditorGridPanel({
                    store: J,
                    id: "editLeadsourceGrid",
                    cm: L,
                    autoExpandColumn: "leadsource",
                    frame: false,
                    viewConfig: {
                        forceFit: true
                    },
                    sm: new Ext.grid.RowSelectionModel({
                        multiSelect: true
                    }),
                    clicksToEdit: 2,
                    tbar: [{
                        text: "new item",
                        iconCls: "actionAdd",
                        handler: H
                    }, {
                        text: "delete item",
                        iconCls: "actionDelete",
                        handler: N
                    }, {
                        text: "save",
                        iconCls: "actionSaveAndClose",
                        handler: I
                    }]
                });
                M.add(P);
                M.show()
            },
            editLeadType: function(Q, J){
                var L = new Ext.Window({
                    title: "Leadtypes",
                    id: "leadtypeWindow",
                    modal: true,
                    width: 350,
                    height: 500,
                    minWidth: 300,
                    minHeight: 500,
                    layout: "fit",
                    plain: true,
                    bodyStyle: "padding:5px;",
                    buttonAlign: "center"
                });
                var P = new Ext.data.JsonStore({
                    baseParams: {
                        method: "Crm.getLeadtypes",
                        sort: "leadtype",
                        dir: "ASC"
                    },
                    root: "results",
                    totalProperty: "totalcount",
                    id: "leadtype_id",
                    fields: [{
                        name: "id"
                    }, {
                        name: "leadtype"
                    }],
                    remoteSort: false
                });
                P.load();
                var M = new Ext.grid.ColumnModel([{
                    id: "id",
                    header: "id",
                    dataIndex: "id",
                    width: 25,
                    hidden: true
                }, {
                    id: "leadtype_id",
                    header: "leadtype",
                    dataIndex: "leadtype",
                    width: 170,
                    hideable: false,
                    sortable: false,
                    editor: new Ext.form.TextField({
                        allowBlank: false
                    })
                }]);
                var N = Ext.data.Record.create([{
                    name: "id",
                    type: "int"
                }, {
                    name: "leadtype",
                    type: "varchar"
                }]);
                var O = function(){
                    var R = new N({
                        leadtype_id: "NULL",
                        leadtype: ""
                    });
                    H.stopEditing();
                    P.insert(0, R);
                    H.startEditing(0, 0);
                    H.fireEvent("celldblclick", this, 0, 1)
                };
                var K = function(){
                    var R = Ext.getCmp("editLeadtypeGrid");
                    var U = R.getStore();
                    var T = R.getSelectionModel().getSelections();
                    for (var S = 0; S < T.length; ++S) {
                        U.remove(T[S])
                    }
                };
                var I = function(){
                    var S = Ext.getCmp("editLeadtypeGrid").getStore();
                    var R = Tine.Tinebase.Common.getJSONdata(S);
                    Ext.Ajax.request({
                        params: {
                            method: "Crm.saveLeadtypes",
                            optionsData: R
                        },
                        text: "Saving leadtypes...",
                        success: function(U, T){
                            S.reload();
                            S.rejectChanges()
                        },
                        failure: function(T, U){
                        }
                    })
                };
                var H = new Ext.grid.EditorGridPanel({
                    store: P,
                    id: "editLeadtypeGrid",
                    cm: M,
                    autoExpandColumn: "leadtype",
                    frame: false,
                    viewConfig: {
                        forceFit: true
                    },
                    sm: new Ext.grid.RowSelectionModel({
                        multiSelect: true
                    }),
                    clicksToEdit: 2,
                    tbar: [{
                        text: "new item",
                        iconCls: "actionAdd",
                        handler: O
                    }, {
                        text: "delete item",
                        iconCls: "actionDelete",
                        handler: K
                    }, {
                        text: "save",
                        iconCls: "actionSaveAndClose",
                        handler: I
                    }]
                });
                L.add(H);
                L.show()
            },
            editProductSource: function(P, J){
                var L = new Ext.Window({
                    title: "Products",
                    id: "productWindow",
                    modal: true,
                    width: 350,
                    height: 500,
                    minWidth: 300,
                    minHeight: 500,
                    layout: "fit",
                    plain: true,
                    bodyStyle: "padding:5px;",
                    buttonAlign: "center"
                });
                var K = new Ext.data.JsonStore({
                    baseParams: {
                        method: "Crm.getProductsource",
                        sort: "productsource",
                        dir: "ASC"
                    },
                    root: "results",
                    totalProperty: "totalcount",
                    id: "id",
                    fields: [{
                        name: "id"
                    }, {
                        name: "productsource"
                    }, {
                        name: "price"
                    }],
                    remoteSort: false
                });
                K.load();
                var O = new Ext.grid.ColumnModel([{
                    id: "id",
                    header: "id",
                    dataIndex: "id",
                    width: 25,
                    hidden: true
                }, {
                    id: "productsource",
                    header: "entries",
                    dataIndex: "productsource",
                    width: 170,
                    hideable: false,
                    sortable: false,
                    editor: new Ext.form.TextField({
                        allowBlank: false
                    })
                }, {
                    id: "price",
                    header: "price",
                    dataIndex: "price",
                    width: 80,
                    align: "right",
                    editor: new Ext.form.NumberField({
                        allowBlank: false,
                        allowNegative: false,
                        decimalSeparator: ","
                    }),
                    renderer: Ext.util.Format.euMoney
                }]);
                var N = Ext.data.Record.create([{
                    name: "id",
                    type: "int"
                }, {
                    name: "productsource",
                    type: "varchar"
                }, {
                    name: "price",
                    type: "number"
                }]);
                var H = function(){
                    var R = new N({
                        id: "NULL",
                        productsource: "",
                        price: "0,00"
                    });
                    I.stopEditing();
                    K.insert(0, R);
                    I.startEditing(0, 0);
                    I.fireEvent("celldblclick", this, 0, 1)
                };
                var M = function(){
                    var T = Ext.getCmp("editProductsourceGrid");
                    var R = T.getStore();
                    var U = T.getSelectionModel().getSelections();
                    for (var S = 0; S < U.length; ++S) {
                        R.remove(U[S])
                    }
                };
                var Q = function(){
                    var R = Ext.getCmp("editProductsourceGrid").getStore();
                    var S = Tine.Tinebase.Common.getJSONdata(R);
                    Ext.Ajax.request({
                        params: {
                            method: "Crm.saveProductsource",
                            optionsData: S
                        },
                        text: "Saving productsource...",
                        success: function(U, T){
                            R.reload();
                            R.rejectChanges()
                        },
                        failure: function(T, U){
                        }
                    })
                };
                var I = new Ext.grid.EditorGridPanel({
                    store: K,
                    id: "editProductsourceGrid",
                    cm: O,
                    autoExpandColumn: "productsource",
                    frame: false,
                    viewConfig: {
                        forceFit: true
                    },
                    sm: new Ext.grid.RowSelectionModel({
                        multiSelect: true
                    }),
                    clicksToEdit: 2,
                    tbar: [{
                        text: "new item",
                        iconCls: "actionAdd",
                        handler: H
                    }, {
                        text: "delete item",
                        iconCls: "actionDelete",
                        handler: M
                    }, {
                        text: "save",
                        iconCls: "actionSaveAndClose",
                        handler: Q
                    }]
                });
                L.add(I);
                L.show()
            }
        },
        reload: function(){
            if (Ext.ComponentMgr.all.containsKey("gridCrm")) {
                setTimeout("Ext.getCmp('gridCrm').getStore().reload()", 200)
            }
        },
        renderer: {
            shortContact: function(K, M, J, H, I, L){
                if (Ext.isArray(K) && K.length > 0) {
                    var N = (K[0].org_name != null) ? K[0].org_name : "";
                    return "<b>" + Ext.util.Format.htmlEncode(N) + "</b><br />" + Ext.util.Format.htmlEncode(K[0].n_fileas)
                }
            },
            detailedContact: function(I, M, S, Q, P, U){
                if (typeof(I) == "object" && !Ext.isEmpty(I)) {
                    var H = "";
                    for (i = 0; i < I.length; i++) {
                        var J = Ext.isEmpty(I[i].org_name) === false ? I[i].org_name : "&nbsp;";
                        var R = Ext.isEmpty(I[i].n_fileas) === false ? I[i].n_fileas : "&nbsp;";
                        var T = Ext.isEmpty(I[i].adr_one_street) === false ? I[i].adr_one_street : "&nbsp;";
                        var K = Ext.isEmpty(I[i].adr_one_postalcode) === false ? I[i].adr_one_postalcode : "&nbsp;";
                        var L = Ext.isEmpty(I[i].adr_one_locality) === false ? I[i].adr_one_locality : "&nbsp;";
                        var N = Ext.isEmpty(I[i].tel_work) === false ? I[i].tel_work : "&nbsp;";
                        var O = Ext.isEmpty(I[i].tel_cell) === false ? I[i].tel_cell : "&nbsp;";
                        if (i > 0) {
                            _style = "borderTop"
                        }
                        else {
                            _style = ""
                        }
                        H = H + '<table width="100%" height="100%" class="' + _style + '"><tr><td colspan="2">' + Ext.util.Format.htmlEncode(J) + '</td></tr><tr><td colspan="2"><b>' + Ext.util.Format.htmlEncode(R) + '</b></td></tr><tr><td colspan="2">' + Ext.util.Format.htmlEncode(T) + '</td></tr><tr><td colspan="2">' + Ext.util.Format.htmlEncode(K) + " " + L + '</td></tr><tr><td width="50%">phone: </td><td width="50%">' + Ext.util.Format.htmlEncode(N) + '</td></tr><tr><td width="50%">cellphone: </td><td width="50%">' + Ext.util.Format.htmlEncode(O) + "</td></tr></table> <br />"
                    }
                    return H
                }
            }
        }
    }
}
();
Ext.namespace("Tine.Crm.LeadEditDialog");
Tine.Crm.LeadEditDialog = function(){
    var B;
    var C;
    var E = new Locale.Gettext();
    E.textdomain("Crm");
    var A = function(){
        var J = {};
        var S = Ext.getCmp("grid_choosenProducts").getStore();
        J.products = Tine.Tinebase.Common.getJSONdata(S);
        var H = Ext.getCmp("start").getValue();
        J.start = H.format("c");
        var N = Ext.getCmp("end").getValue();
        if (typeof N == "object") {
            J.end = N.format("c")
        }
        else {
            J.end = null
        }
        var O = Ext.getCmp("end_scheduled").getValue();
        if (typeof O == "object") {
            J.end_scheduled = O.format("c")
        }
        else {
            J.end_scheduled = null
        }
        var I = new Array();
        var R = Tine.Crm.LeadEditDialog.Stores.getContactsCustomer();
        R.each(function(T){
            I.push(T.id)
        });
        J.linkedCustomer = Ext.util.JSON.encode(I);
        var P = new Array();
        var K = Tine.Crm.LeadEditDialog.Stores.getContactsPartner();
        K.each(function(T){
            P.push(T.id)
        });
        J.linkedPartner = Ext.util.JSON.encode(P);
        var F = new Array();
        var Q = Tine.Crm.LeadEditDialog.Stores.getContactsInternal();
        Q.each(function(T){
            F.push(T.id)
        });
        J.linkedAccount = Ext.util.JSON.encode(F);
        var L = new Array();
        var G = Ext.getCmp("gridActivities");
        var M = G.getStore();
        M.each(function(T){
            L.push(T.data.id)
        });
        J.linkedTasks = Ext.util.JSON.encode(L);
        return J
    };
    var D = function(j){
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = "side";
        j = new Tine.Crm.Model.Lead(j);
        Tine.Crm.Model.Lead.FixDates(j);
        var a = true;
        var u = function(AA){
            AA.baseParams.method = "Crm.getEvents";
            AA.baseParams.options = Ext.encode({})
        };
        var R = function(AB, AA){
            editWindow.show()
        };
        var m = new Ext.form.TextField({
            hideLabel: true,
            id: "lead_name",
            emptyText: E._("Enter short name"),
            name: "lead_name",
            allowBlank: false,
            selectOnFocus: true,
            anchor: "100%"
        });
        var V = new Ext.form.ComboBox({
            fieldLabel: E._("Leadstate"),
            id: "leadstatus",
            name: "leadstate_id",
            store: Tine.Crm.LeadEditDialog.Stores.getLeadStatus(),
            displayField: "value",
            valueField: "key",
            mode: "local",
            triggerAction: "all",
            editable: false,
            allowBlank: false,
            listWidth: "25%",
            forceSelection: true,
            anchor: "95%"
        });
        V.on("select", function(AD, AB, AC){
            if (AB.data.probability !== null) {
                var AA = Ext.getCmp("combo_probability");
                AA.setValue(AB.data.probability)
            }
            if (AB.data.endslead == "1") {
                var AE = Ext.getCmp("end");
                AE.setValue(new Date())
            }
        });
        var k = new Ext.form.ComboBox({
            fieldLabel: E._("Leadtype"),
            id: "leadtype",
            name: "leadtype_id",
            store: Tine.Crm.LeadEditDialog.Stores.getLeadType(),
            mode: "local",
            displayField: "value",
            valueField: "key",
            typeAhead: true,
            triggerAction: "all",
            listWidth: "25%",
            editable: false,
            allowBlank: false,
            forceSelection: true,
            anchor: "95%"
        });
        var O = new Ext.data.JsonStore({
            data: formData.comboData.leadsources,
            autoLoad: true,
            id: "key",
            fields: [{
                name: "key",
                mapping: "id"
            }, {
                name: "value",
                mapping: "leadsource"
            }]
        });
        var L = new Ext.form.ComboBox({
            fieldLabel: E._("Leadsource"),
            id: "leadsource",
            name: "leadsource_id",
            store: O,
            displayField: "value",
            valueField: "key",
            typeAhead: true,
            listWidth: "25%",
            mode: "local",
            triggerAction: "all",
            editable: false,
            allowBlank: false,
            forceSelection: true,
            anchor: "95%"
        });
        var o = Tine.Crm.LeadEditDialog.Stores.getActivities(j.data.tasks);
        var Y = new Ext.form.ComboBox({
            fieldLabel: E._("Probability"),
            id: "combo_probability",
            name: "probability",
            store: Tine.Crm.LeadEditDialog.Stores.getProbability(),
            displayField: "value",
            valueField: "key",
            typeAhead: true,
            mode: "local",
            listWidth: "25%",
            triggerAction: "all",
            emptyText: "",
            selectOnFocus: true,
            editable: false,
            renderer: Ext.util.Format.percentage,
            anchor: "95%"
        });
        Y.setValue("0");
        var x = new Ext.form.DateField({
            fieldLabel: E._("Start"),
            allowBlank: false,
            id: "start",
            anchor: "95%"
        });
        var T = new Ext.form.DateField({
            fieldLabel: E._("Estimated end"),
            id: "end_scheduled",
            anchor: "95%"
        });
        var e = new Ext.form.DateField({
            xtype: "datefield",
            fieldLabel: E._("End"),
            id: "end",
            anchor: "95%"
        });
        activitiesGetStatusIcon = function(AA){
            return '<div class="TasksMainGridStatus-' + AA + '" ext:qtip="' + AA + '"></div>'
        };
        var X = new Ext.XTemplate('<tpl for=".">', '<div class="activities-item-small">', '<div class="TasksMainGridStatus-{status_realname}" ext:qtip="{status_realname}"></div> {due}<br/>', "<i>{creator}</i><br />", "<b>{[this.encode(values.summary)]}</b><br />", "{[this.encode(values.description)]}<br />", "</div></tpl>", {
            setContactField: function(AA){
                alert(AA);
                if ((AA === null) || (AA.length === 0)) {
                    return ""
                }
                else {
                    return Ext.util.Format.htmlEncode(AA) + "<br />"
                }
            },
            encode: function(AA){
                return Ext.util.Format.htmlEncode(AA)
            }
        });
        if (j.data) {
            var F = j.data.id
        }
        else {
            var F = "NULL"
        }
        var I = new Ext.data.JsonStore({
            data: j.data.products,
            autoLoad: true,
            id: "id",
            fields: [{
                name: "id"
            }, {
                name: "product_id"
            }, {
                name: "product_desc"
            }, {
                name: "product_price"
            }]
        });
        I.on("update", function(AD, AB, AE){
            if (AB.data.product_id && !arguments[1].modified.product_price) {
                var AA = Tine.Crm.LeadEditDialog.Stores.getProductsAvailable();
                var AC = AA.getById(AB.data.product_id);
                AB.data.product_price = AC.data.price
            }
        });
        var N = Tine.Crm.LeadEditDialog.Stores.getProductsAvailable();
        var d = new Ext.grid.ColumnModel([{
            header: "id",
            dataIndex: "id",
            width: 1,
            hidden: true,
            sortable: false,
            fixed: true
        }, {
            header: E._("Product"),
            id: "cm_product",
            dataIndex: "product_id",
            width: 300,
            editor: new Ext.form.ComboBox({
                name: "product_combo",
                id: "product_combo",
                hiddenName: "id",
                store: N,
                displayField: "productsource",
                valueField: "id",
                allowBlank: false,
                typeAhead: true,
                editable: true,
                selectOnFocus: true,
                forceSelection: true,
                triggerAction: "all",
                mode: "local",
                lazyRender: true,
                listClass: "x-combo-list-small"
            }),
            renderer: function(AA){
                record = N.getById(AA);
                if (record) {
                    return Ext.util.Format.htmlEncode(record.data.productsource)
                }
                else {
                    Ext.getCmp("leadDialog").doLayout();
                    return Ext.util.Format.htmlEncode(AA)
                }
            }
        }, {
            header: E._("Serialnumber"),
            dataIndex: "product_desc",
            width: 300,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            header: E._("Price"),
            dataIndex: "product_price",
            width: 150,
            align: "right",
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                decimalSeparator: ","
            }),
            renderer: Ext.util.Format.euMoney
        }]);
        var t = Ext.getCmp("product_combo");
        t.on("change", function(AA, AB){
        });
        var z = function(AF, AA){
            var AD = Ext.getCmp("grid_choosenProducts");
            var AB = AD.getStore();
            var AE = AD.getSelectionModel().getSelections();
            for (var AC = 0; AC < AE.length; ++AC) {
                AB.remove(AE[AC])
            }
        };
        var J = function(AF, AB){
            var AA = Ext.getCmp("gridActivities");
            var AC = AA.getStore();
            var AE = AA.getSelectionModel().getSelections();
            for (var AD = 0; AD < AE.length; ++AD) {
                AC.remove(AE[AD])
            }
        };
        var p = Ext.data.Record.create([{
            name: "id",
            type: "int"
        }, {
            name: "lead_id",
            type: "int"
        }, {
            name: "product_id",
            type: "int"
        }, {
            name: "product_desc",
            type: "string"
        }, {
            name: "product_price",
            type: "float"
        }]);
        var W = new Ext.grid.EditorGridPanel({
            store: I,
            id: "grid_choosenProducts",
            cm: d,
            mode: "local",
            sm: new Ext.grid.RowSelectionModel({
                multiSelect: true
            }),
            anchor: "100% 100%",
            autoExpandColumn: "cm_product",
            frame: false,
            clicksToEdit: 1,
            tbar: [{
                text: E._("Add product"),
                iconCls: "actionAdd",
                handler: function(){
                    var AA = new p({
                        id: "NULL",
                        lead_id: F,
                        product_id: "",
                        product_desc: "",
                        product_price: ""
                    });
                    W.stopEditing();
                    I.insert(0, AA);
                    W.startEditing(0, 0);
                    W.fireEvent("cellclick", this, 0, 1)
                }
            }, {
                text: E._("Delete product"),
                iconCls: "actionDelete",
                handler: z
            }]
        });
        W.on("rowcontextmenu", function(AB, AA, AC){
            AC.stopEvent();
            if (!AB.getSelectionModel().isSelected(AA)) {
                AB.getSelectionModel().selectRow(AA)
            }
        });
        var P = Tine.Crm.LeadEditDialog.Stores.getContactsCustomer();
        var Q = Tine.Crm.LeadEditDialog.Stores.getContactsPartner();
        var v = Tine.Crm.LeadEditDialog.Stores.getContactsInternal();
        var S = Tine.Crm.LeadEditDialog.Stores.getContactsSearch();
        var h = new Ext.grid.ColumnModel([{
            id: "id",
            header: "id",
            dataIndex: "id",
            width: 25,
            sortable: true,
            hidden: true
        }, {
            id: "n_fileas",
            header: E._("Name"),
            dataIndex: "n_fileas",
            width: 100,
            sortable: true,
            renderer: function(AE, AD, AA){
                var AB = Ext.isEmpty(AA.data.org_name) === false ? AA.data.org_name : "&nbsp;";
                var AC = "<b>" + Ext.util.Format.htmlEncode(AA.data.n_fileas) + "</b><br />" + Ext.util.Format.htmlEncode(AB);
                return AC
            }
        }, {
            id: "contact_one",
            header: E._("Address"),
            dataIndex: "adr_one_locality",
            width: 170,
            sortable: false,
            renderer: function(AD, AC, AA){
                var AB = Ext.util.Format.htmlEncode(AA.data.adr_one_street) + "<br />" + Ext.util.Format.htmlEncode(AA.data.adr_one_postalcode) + " " + Ext.util.Format.htmlEncode(AA.data.adr_one_locality);
                return AB
            }
        }, {
            id: "tel_work",
            header: E._("Contactdata"),
            dataIndex: "tel_work",
            width: 200,
            sortable: false,
            renderer: function(AD, AC, AA){
                var AB = "<table><tr><td>Phone: </td><td>" + Ext.util.Format.htmlEncode(AA.data.tel_work) + "</td></tr><tr><td>Cellphone: </td><td>" + Ext.util.Format.htmlEncode(AA.data.tel_cell) + "</td></tr></table>";
                return AB
            }
        }]);
        var q = new Ext.grid.ColumnModel([{
            id: "identifier",
            header: E._("Identifier"),
            dataIndex: "identifier",
            width: 5,
            sortable: true,
            hidden: true
        }, {
            id: "status",
            header: E._("Status"),
            width: 40,
            sortable: true,
            dataIndex: "status_realname",
            renderer: activitiesGetStatusIcon
        }, {
            id: "percent",
            header: E._("Percent"),
            width: 50,
            sortable: true,
            dataIndex: "percent"
        }, {
            id: "summary",
            header: E._("Summary"),
            width: 200,
            sortable: true,
            dataIndex: "summary"
        }, {
            id: "due",
            header: E._("Due date"),
            width: 80,
            sortable: true,
            dataIndex: "due",
            renderer: Tine.Tinebase.Common.dateRenderer
        }, {
            id: "creator",
            header: E._("Creator"),
            width: 130,
            sortable: true,
            dataIndex: "creator"
        }, {
            id: "description",
            header: E._("Description"),
            width: 240,
            sortable: false,
            dataIndex: "description"
        }]);
        var g = new Ext.Action({
            text: E._("Add task"),
            handler: function(){
                popupWindow = new Tine.Tasks.EditPopup({
                    relatedApp: "crm",
                    relatedId: j.data.id
                });
                popupWindow.on("update", function(AA){
                    var AB = o.getCount();
                    AA.id = AA.data.id;
                    o.insert(AB, [AA])
                }, this)
            },
            iconCls: "actionAddTask",
            disabled: true
        });
        var l = new Ext.Action({
            text: E._("Export as PDF"),
            handler: function(){
                var AA = j.data.id;
                Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Crm.exportLead&_format=pdf&_leadId=" + AA, 768, 1024)
            },
            iconCls: "action_exportAsPdf",
            disabled: true
        });
        if (j.data.id > 0) {
            g.enable();
            l.enable()
        }
        var r = new Ext.grid.GridPanel({
            id: "gridActivities",
            store: o,
            cm: q,
            tbar: [g, {
                text: E._("Delete task"),
                iconCls: "actionDelete",
                handler: J
            }],
            stripeRows: true,
            viewConfig: {
                forceFit: true
            },
            autoSizeColumns: true,
            sm: new Ext.grid.RowSelectionModel({
                multiSelect: true
            }),
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "description",
            border: false,
            height: 600
        });
        r.on("rowdblclick", function(AC, AA, AD){
            var AB = AC.getStore().getAt(AA);
            popupWindow = new Tine.Tasks.EditPopup({
                id: AB.data.id
            });
            popupWindow.on("update", function(AF){
                var AE = o.getById(AF.data.id);
                var AG = o.indexOf(AE);
                AF.id = AF.data.id;
                o.remove(AE);
                o.insert(AG, [AF]);
                o.commitChanges()
            }, this)
        });
        var n = new Tine.widgets.container.selectionComboBox({
            fieldLabel: E._("folder"),
            name: "container",
            itemName: "Leads",
            appName: "crm",
            anchor: "95%"
        });
        var H = {
            title: E._("Overview"),
            layout: "border",
            layoutOnTabChange: true,
            defaults: {
                border: true,
                frame: true
            },
            items: [{
                title: E._("Last activities"),
                region: "east",
                autoScroll: true,
                width: 300,
                items: [new Ext.DataView({
                    tpl: X,
                    autoHeight: true,
                    id: "grid_activities_limited",
                    store: o,
                    overClass: "x-view-over",
                    itemSelector: "activities-item-small"
                })]
            }, {
                region: "center",
                layout: "form",
                autoHeight: true,
                id: "editCenterPanel",
                items: [m, {
                    xtype: "textarea",
                    id: "lead_notes",
                    hideLabel: true,
                    name: "description",
                    height: 120,
                    anchor: "100%",
                    emptyText: E._("Enter description")
                }, {
                    layout: "column",
                    height: 140,
                    id: "lead_combos",
                    anchor: "100%",
                    items: [{
                        columnWidth: 0.33,
                        items: [{
                            layout: "form",
                            items: [V, k, L]
                        }]
                    }, {
                        columnWidth: 0.33,
                        items: [{
                            layout: "form",
                            border: false,
                            items: [{
                                xtype: "numberfield",
                                fieldLabel: E._("Expected turnover"),
                                name: "turnover",
                                selectOnFocus: true,
                                anchor: "95%"
                            }, Y, n]
                        }]
                    }, {
                        columnWidth: 0.33,
                        items: [{
                            layout: "form",
                            border: false,
                            items: [x, T, e]
                        }]
                    }]
                }, {
                    xtype: "tabpanel",
                    style: "margin-top: 10px;",
                    id: "contactsPanel",
                    title: "contacts panel",
                    activeTab: 0,
                    height: 273,
                    items: [{
                        xtype: "grid",
                        title: E._("Customer"),
                        cm: h,
                        store: P,
                        autoExpandColumn: "n_fileas"
                    }, {
                        xtype: "grid",
                        title: E._("Partner"),
                        cm: h,
                        store: Q,
                        autoExpandColumn: "n_fileas"
                    }, {
                        xtype: "grid",
                        title: E._("Internal"),
                        cm: h,
                        store: v,
                        autoExpandColumn: "n_fileas"
                    }]
                }]
            }]
        };
        var M = {
            title: E._("Manage activities"),
            layout: "form",
            disabled: false,
            layoutOnTabChange: true,
            deferredRender: false,
            anchor: "100% 100%",
            border: false,
            items: [r]
        };
        var c = {
            title: E._("Manage products"),
            layout: "form",
            layoutOnTabChange: true,
            deferredRender: false,
            anchor: "100% 100%",
            border: false,
            items: [W]
        };
        var y = function(AE, AA){
            var AD = arguments[2] ? arguments[2] : false;
            var AC = Ext.getCmp("leadDialog").getForm();
            if (AC.isValid()) {
                Ext.MessageBox.wait(E._("Please wait"), E._("Saving lead") + "...");
                AC.updateRecord(j);
                var AB = A();
                Ext.Ajax.request({
                    params: {
                        method: "Crm.saveLead",
                        lead: Ext.util.JSON.encode(j.data),
                        linkedCustomer: AB.linkedCustomer,
                        linkedPartner: AB.linkedPartner,
                        linkedAccount: AB.linkedAccount,
                        linkedTasks: AB.linkedTasks,
                        products: AB.products
                    },
                    success: function(AG, AF){
                        if (window.opener.Tine.Crm) {
                            window.opener.Tine.Crm.Main.reload()
                        }
                        if (AD) {
                            window.setTimeout("window.close()", 400)
                        }
                        j = new Tine.Crm.Model.Lead(Ext.util.JSON.decode(AG.responseText));
                        Tine.Crm.Model.Lead.FixDates(j);
                        AC.loadRecord(j);
                        g.enable();
                        l.enable();
                        Ext.MessageBox.hide()
                    },
                    failure: function(AF, AG){
                        Ext.MessageBox.alert("Failed", E._("Could not save lead."))
                    }
                })
            }
            else {
                Ext.MessageBox.alert("Errors", E._("Please fix the errors noted."))
            }
        };
        var G = function(AB, AA){
            y(AB, AA, true)
        };
        var f = new Tine.widgets.dialog.EditRecord({
            id: "leadDialog",
            tbarItems: [g, l],
            handlerApplyChanges: y,
            handlerSaveAndClose: G,
            handlerDelete: Tine.Crm.LeadEditDialog.Handler.handlerDelete,
            labelAlign: "top",
            items: new Ext.TabPanel({
                plain: true,
                activeTab: 0,
                id: "editMainTabPanel",
                layoutOnTabChange: true,
                items: [H, Tine.Crm.LeadEditDialog.Elements.getTabPanelManageContacts(), M, c]
            })
        });
        Ext.getCmp("editMainTabPanel").on("afterlayout", function(AB){
            var AA = Ext.getCmp("leadDialog").getInnerHeight();
            Ext.getCmp("editMainTabPanel").setHeight(AA - 10)
        });
        var s = new Ext.Viewport({
            layout: "border",
            id: "editViewport",
            items: f
        });
        Tine.Crm.LeadEditDialog.Stores.getContactsCustomer(j.data.contactsCustomer);
        Tine.Crm.LeadEditDialog.Stores.getContactsPartner(j.data.contactsPartner);
        Tine.Crm.LeadEditDialog.Stores.getContactsInternal(j.data.contactsInternal);
        Tine.Crm.LeadEditDialog.Stores.getActivities(j.data.tasks);
        f.getForm().loadRecord(j);
        var U = function(AA, AC, AB){
            var AE = Ext.getCmp("crm_editLead_ListContactsTabPanel").getActiveTab().getId();
            if (AE == "crm_gridAccount") {
                var AD = "Addressbook.getAccounts"
            }
            else {
                var AD = "Addressbook.getAllContacts"
            }
            if (AC === "") {
                Tine.Crm.LeadEditDialog.Stores.getContactsSearch().removeAll()
            }
            else {
                Tine.Crm.LeadEditDialog.Stores.getContactsSearch().load({
                    params: {
                        start: 0,
                        limit: 50,
                        query: AC,
                        method: AD
                    }
                })
            }
        };
        Ext.getCmp("crm_gridCostumer").on("rowdblclick", function(AC, AA, AD){
            var AB = AC.getStore().getAt(AA);
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=" + AB.id, 850, 600)
        });
        Ext.getCmp("crm_gridPartner").on("rowdblclick", function(AC, AA, AD){
            var AB = AC.getStore().getAt(AA);
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=" + AB.id, 850, 600)
        });
        Ext.getCmp("crm_gridAccount").on("rowdblclick", function(AC, AA, AD){
            var AB = AC.getStore().getAt(AA);
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=" + AB.id, 850, 600)
        });
        Ext.getCmp("crm_editLead_SearchContactsField").on("change", U);
        Ext.getCmp("crm_editLead_SearchContactsGrid").on("rowdblclick", function(AD, AB, AE){
            var AC = AD.getStore().getAt(AB);
            var AF = Ext.getCmp("crm_editLead_ListContactsTabPanel").getActiveTab().getStore();
            if (AF.getById(AC.id) === undefined) {
                AF.addSorted(AC, AC.id)
            }
            var AA = Ext.getCmp("crm_editLead_ListContactsTabPanel").getActiveTab().getSelectionModel();
            AA.selectRow(AF.indexOfId(AC.id))
        });
        var K = function(AB){
            var AA = AB.getCount();
            if (AA < 1) {
                Tine.Crm.LeadEditDialog.Elements.actionRemoveContact.setDisabled(true)
            }
            else {
                Tine.Crm.LeadEditDialog.Elements.actionRemoveContact.setDisabled(false)
            }
        };
        var Z = function(AA){
            K(AA.getSelectionModel());
            U(Ext.getCmp("crm_editLead_SearchContactsField"), Ext.getCmp("crm_editLead_SearchContactsField").getValue(), Ext.getCmp("crm_editLead_SearchContactsField").getValue())
        };
        Ext.getCmp("crm_gridCostumer").getSelectionModel().on("selectionchange", K);
        Ext.getCmp("crm_gridPartner").getSelectionModel().on("selectionchange", K);
        Ext.getCmp("crm_gridAccount").getSelectionModel().on("selectionchange", K);
        Ext.getCmp("crm_gridCostumer").on("activate", Z);
        Ext.getCmp("crm_gridPartner").on("activate", Z);
        Ext.getCmp("crm_gridAccount").on("activate", Z);
        var w = function(AB){
            var AA = AB.getCount();
            if (AA < 1) {
                Tine.Crm.LeadEditDialog.Elements.actionAddContactToList.setDisabled(true)
            }
            else {
                Tine.Crm.LeadEditDialog.Elements.actionAddContactToList.setDisabled(false)
            }
        };
        Ext.getCmp("crm_editLead_SearchContactsGrid").getSelectionModel().on("selectionchange", w)
    };
    return {
        displayDialog: function(F){
            D(F)
        }
    }
}
();
Tine.Crm.LeadEditDialog.Handler = function(){
    return {
        removeContact: function(E, A){
            var D = Ext.getCmp("crm_editLead_ListContactsTabPanel").getActiveTab();
            var C = D.getSelectionModel().getSelections();
            var F = D.getStore();
            for (var B = 0; B < C.length; ++B) {
                F.remove(C[B])
            }
        },
        addContact: function(B, A){
            Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=", 850, 600)
        },
        addContactToList: function(E, B){
            var D = Ext.getCmp("crm_editLead_SearchContactsGrid").getSelectionModel().getSelections();
            var F = Ext.getCmp("crm_editLead_ListContactsTabPanel").getActiveTab().getStore();
            for (var C = 0; C < D.length; ++C) {
                if (F.getById(D[C].id) === undefined) {
                    F.addSorted(D[C], D[C].id)
                }
            }
            var A = Ext.getCmp("crm_editLead_ListContactsTabPanel").getActiveTab().getSelectionModel();
            A.selectRow(F.indexOfId(D[0].id))
        },
        handlerDelete: function(){
            Ext.MessageBox.confirm("Confirm", "Are you sure you want to delete this lead?", function(B){
                if (B == "yes") {
                    var A;
                    Ext.Ajax.request({
                        params: {
                            method: "Crm.deleteLeads",
                            _leadIds: A
                        },
                        text: "Deleting lead...",
                        success: function(D, C){
                            window.opener.Tine.Crm.reload();
                            window.setTimeout("window.close()", 400)
                        },
                        failure: function(C, D){
                            Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the lead.")
                        }
                    })
                }
            })
        }
    }
}
();
Tine.Crm.LeadEditDialog.Elements = function(){
    return {
        actionRemoveContact: new Ext.Action({
            text: "remove contact from list",
            disabled: true,
            handler: Tine.Crm.LeadEditDialog.Handler.removeContact,
            iconCls: "actionDelete"
        }),
        actionAddContact: new Ext.Action({
            text: "create new contact",
            handler: Tine.Crm.LeadEditDialog.Handler.addContact,
            iconCls: "actionAdd"
        }),
        actionAddContactToList: new Ext.Action({
            text: "add contact to list",
            disabled: true,
            handler: function(B, A){
                Tine.Crm.LeadEditDialog.Handler.addContactToList(Ext.getCmp("crm_editLead_SearchContactsGrid"))
            },
            iconCls: "actionAdd"
        }),
        columnModelDisplayContacts: new Ext.grid.ColumnModel([{
            id: "id",
            header: "id",
            dataIndex: "id",
            width: 25,
            sortable: true,
            hidden: true
        }, {
            id: "n_fileas",
            header: "Name / Address",
            dataIndex: "n_fileas",
            width: 100,
            sortable: true,
            renderer: function(A, H, E){
                var G = Ext.isEmpty(E.data.n_fileas) === false ? E.data.n_fileas : "";
                var B = Ext.isEmpty(E.data.org_name) === false ? E.data.org_name : "";
                var I = Ext.isEmpty(E.data.adr_one_street) === false ? E.data.adr_one_street : "";
                var C = Ext.isEmpty(E.data.adr_one_postalcode) === false ? E.data.adr_one_postalcode : "";
                var D = Ext.isEmpty(E.data.adr_one_locality) === false ? E.data.adr_one_locality : "";
                var F = "<b>" + Ext.util.Format.htmlEncode(G) + "</b><br />" + Ext.util.Format.htmlEncode(B) + "<br  />" + Ext.util.Format.htmlEncode(I) + "<br />" + Ext.util.Format.htmlEncode(C) + " " + Ext.util.Format.htmlEncode(D);
                return F
            }
        }, {
            id: "contact_one",
            header: "Phone",
            dataIndex: "adr_one_locality",
            width: 170,
            sortable: false,
            renderer: function(G, F, A){
                var C = Ext.isEmpty(A.data.tel_work) === false ? A.data.tel_work : "";
                var D = Ext.isEmpty(A.data.tel_fax) === false ? A.data.tel_fax : "";
                var B = Ext.isEmpty(A.data.tel_cell) === false ? A.data.tel_cell : "";
                var E = "<table><tr><td>Phone: </td><td>" + Ext.util.Format.htmlEncode(C) + "</td></tr><tr><td>Fax: </td><td>" + Ext.util.Format.htmlEncode(D) + "</td></tr><tr><td>Cellphone: </td><td>" + Ext.util.Format.htmlEncode(B) + "</td></tr></table>";
                return E
            }
        }, {
            id: "tel_work",
            header: "Internet",
            dataIndex: "tel_work",
            width: 200,
            sortable: false,
            renderer: function(F, E, A){
                var C = Ext.isEmpty(A.data.email) === false ? '<a href="mailto:' + A.data.email + '">' + A.data.email + "</a>" : "";
                var B = Ext.isEmpty(A.data.contact_url) === false ? A.data.contact_url : "";
                var D = "<table><tr><td>Email: </td><td>" + Ext.util.Format.htmlEncode(C) + "</td></tr><tr><td>WWW: </td><td>" + Ext.util.Format.htmlEncode(B) + "</td></tr></table>";
                return D
            }
        }]),
        columnModelSearchContacts: new Ext.grid.ColumnModel([{
            id: "n_fileas",
            header: "Name",
            dataIndex: "n_fileas",
            sortable: true,
            renderer: function(D, C, A){
                var B = null;
                if (Ext.isEmpty(A.data.n_fileas) === false) {
                    B = "<b>" + Ext.util.Format.htmlEncode(A.data.n_fileas) + "</b><br />"
                }
                if (Ext.isEmpty(A.data.org_name) === false) {
                    if (B === null) {
                        B = "<b>" + Ext.util.Format.htmlEncode(A.data.org_name) + "</b><br />"
                    }
                    else {
                        B += Ext.util.Format.htmlEncode(A.data.org_name) + "<br />"
                    }
                }
                if (Ext.isEmpty(A.data.adr_one_street) === false) {
                    B += Ext.util.Format.htmlEncode(A.data.adr_one_street) + "<br />"
                }
                if ((Ext.isEmpty(A.data.adr_one_postalcode) === false) && (Ext.isEmpty(A.data.adr_one_locality) === false)) {
                    B += Ext.util.Format.htmlEncode(A.data.adr_one_postalcode) + " " + Ext.util.Format.htmlEncode(A.data.adr_one_locality) + "<br />"
                }
                else {
                    if (Ext.isEmpty(A.data.adr_one_locality) === false) {
                        B += Ext.util.Format.htmlEncode(A.data.adr_one_locality) + "<br />"
                    }
                }
                return B
            }
        }]),
        getTabPanelManageContacts: function(){
            var B = new Ext.ux.SearchField({
                id: "crm_editLead_SearchContactsField",
                width: 250,
                emptyText: "enter searchfilter"
            });
            B.on("resize", function(){
                B.wrap.setWidth(280)
            });
            var A = new Ext.Toolbar({
                items: [B]
            });
            var C = {
                title: "manage contacts",
                layout: "border",
                defaults: {
                    border: false
                },
                items: [{
                    region: "west",
                    xtype: "tabpanel",
                    width: 300,
                    split: true,
                    activeTab: 0,
                    tbar: [Tine.Crm.LeadEditDialog.Elements.actionAddContactToList],
                    items: [{
                        xtype: "grid",
                        id: "crm_editLead_SearchContactsGrid",
                        title: "Search",
                        cm: this.columnModelSearchContacts,
                        store: Tine.Crm.LeadEditDialog.Stores.getContactsSearch(),
                        autoExpandColumn: "n_fileas",
                        tbar: A
                    }, {
                        title: "Browse",
                        html: "Browse",
                        disabled: true
                    }]
                }, {
                    region: "center",
                    xtype: "tabpanel",
                    id: "crm_editLead_ListContactsTabPanel",
                    title: "contacts panel",
                    activeTab: 0,
                    tbar: [Tine.Crm.LeadEditDialog.Elements.actionAddContact, Tine.Crm.LeadEditDialog.Elements.actionRemoveContact],
                    items: [{
                        xtype: "grid",
                        id: "crm_gridCostumer",
                        title: "Customer",
                        cm: this.columnModelDisplayContacts,
                        store: Tine.Crm.LeadEditDialog.Stores.getContactsCustomer(),
                        autoExpandColumn: "n_fileas"
                    }, {
                        xtype: "grid",
                        id: "crm_gridPartner",
                        title: "Partner",
                        cm: this.columnModelDisplayContacts,
                        store: Tine.Crm.LeadEditDialog.Stores.getContactsPartner(),
                        autoExpandColumn: "n_fileas"
                    }, {
                        xtype: "grid",
                        id: "crm_gridAccount",
                        title: "Internal",
                        cm: this.columnModelDisplayContacts,
                        store: Tine.Crm.LeadEditDialog.Stores.getContactsInternal(),
                        autoExpandColumn: "n_fileas"
                    }]
                }]
            };
            return C
        }
    }
}
();
Tine.Crm.LeadEditDialog.Stores = function(){
    var A = null;
    var B = null;
    var C = null;
    var D = null;
    return {
        contactFields: [{
            name: "link_id"
        }, {
            name: "link_remark"
        }, {
            name: "id"
        }, {
            name: "owner"
        }, {
            name: "n_family"
        }, {
            name: "n_given"
        }, {
            name: "n_middle"
        }, {
            name: "n_prefix"
        }, {
            name: "n_suffix"
        }, {
            name: "n_fn"
        }, {
            name: "n_fileas"
        }, {
            name: "org_name"
        }, {
            name: "org_unit"
        }, {
            name: "adr_one_street"
        }, {
            name: "adr_one_locality"
        }, {
            name: "adr_one_region"
        }, {
            name: "adr_one_postalcode"
        }, {
            name: "adr_one_countryname"
        }, {
            name: "tel_work"
        }, {
            name: "tel_cell"
        }, {
            name: "tel_fax"
        }, {
            name: "email"
        }],
        getContactsCustomer: function(E){
            if (B === null) {
                B = new Ext.data.JsonStore({
                    id: "id",
                    fields: this.contactFields
                })
            }
            if (E) {
                B.loadData(E)
            }
            return B
        },
        getContactsPartner: function(E){
            if (C === null) {
                C = new Ext.data.JsonStore({
                    id: "id",
                    fields: this.contactFields
                })
            }
            if (E) {
                C.loadData(E)
            }
            return C
        },
        getContactsInternal: function(E){
            if (A === null) {
                A = new Ext.data.JsonStore({
                    id: "id",
                    fields: this.contactFields
                })
            }
            if (E) {
                A.loadData(E)
            }
            return A
        },
        getContactsSearch: function(){
            if (D === null) {
                D = new Ext.data.JsonStore({
                    baseParams: {
                        method: "Addressbook.getAllContacts",
                        start: 0,
                        sort: "n_fileas",
                        dir: "asc",
                        limit: 0,
                        tagFilter: 0
                    },
                    root: "results",
                    totalProperty: "totalcount",
                    id: "id",
                    fields: this.contactFields,
                    remoteSort: true
                });
                D.setDefaultSort("n_fileas", "asc")
            }
            return D
        },
        getLeadStatus: function(){
            var E = new Ext.data.JsonStore({
                data: formData.comboData.leadstates,
                autoLoad: true,
                id: "key",
                fields: [{
                    name: "key",
                    mapping: "id"
                }, {
                    name: "value",
                    mapping: "leadstate"
                }, {
                    name: "probability",
                    mapping: "probability"
                }, {
                    name: "endslead",
                    mapping: "endslead"
                }]
            });
            return E
        },
        getProductsAvailable: function(){
            var E = new Ext.data.JsonStore({
                data: formData.comboData.productsource,
                autoLoad: true,
                id: "id",
                fields: [{
                    name: "id"
                }, {
                    name: "productsource"
                }, {
                    name: "price"
                }]
            });
            return E
        },
        getLeadType: function(){
            var E = new Ext.data.JsonStore({
                data: formData.comboData.leadtypes,
                autoLoad: true,
                id: "key",
                fields: [{
                    name: "key",
                    mapping: "id"
                }, {
                    name: "value",
                    mapping: "leadtype"
                }]
            });
            return E
        },
        getActivities: function(F){
            var E = new Ext.data.JsonStore({
                id: "id",
                fields: Tine.Tasks.Task
            });
            if (F) {
                E.loadData(F)
            }
            return E
        },
        getProbability: function(){
            var E = new Ext.data.SimpleStore({
                fields: ["key", "value"],
                data: [["0", "0%"], ["10", "10%"], ["20", "20%"], ["30", "30%"], ["40", "40%"], ["50", "50%"], ["60", "60%"], ["70", "70%"], ["80", "80%"], ["90", "90%"], ["100", "100%"]]
            });
            return E
        }
    }
}
();
Tine.Crm.Model = {};
Tine.Crm.Model.Lead = Ext.data.Record.create([{
    name: "id",
    type: "int"
}, {
    name: "lead_name",
    type: "string"
}, {
    name: "leadstate_id",
    type: "int"
}, {
    name: "leadtype_id",
    type: "int"
}, {
    name: "leadstate",
    type: "int"
}, {
    name: "leadsource_id",
    type: "int"
}, {
    name: "container",
    type: "int"
}, {
    name: "modifier",
    type: "int"
}, {
    name: "start",
    type: "date",
    dateFormat: "c"
}, {
    name: "modified"
}, {
    name: "description",
    type: "string"
}, {
    name: "end",
    type: "date",
    dateFormat: "c"
}, {
    name: "turnover",
    type: "int"
}, {
    name: "probability",
    type: "int"
}, {
    name: "end_scheduled",
    type: "date",
    dateFormat: "c"
}, {
    name: "lastread"
}, {
    name: "lastreader"
}, {
    name: "leadstate"
}, {
    name: "leadtype"
}, {
    name: "leadsource"
}, {
    name: "partner"
}, {
    name: "customer"
}]);
Tine.Crm.Model.Lead.FixDates = function(A){
    A.data.start = A.data.start ? Date.parseDate(A.data.start, "c") : A.data.start;
    A.data.end = A.data.end ? Date.parseDate(A.data.end, "c") : A.data.end;
    A.data.end_scheduled = A.data.end_scheduled ? Date.parseDate(A.data.end_scheduled, "c") : A.data.end_scheduled
};
Ext.namespace("Tine.Crm", "Tine.Crm.LeadState");
Tine.Crm.LeadState.Model = Ext.data.Record.create([{
    name: "id"
}, {
    name: "leadstate"
}, {
    name: "probability"
}, {
    name: "endslead",
    type: "boolean"
}]);
Tine.Crm.LeadState.getStore = function(){
    var A = Ext.StoreMgr.get("CrmLeadstateStore");
    if (!A) {
        A = new Ext.data.JsonStore({
            baseParams: {
                method: "Crm.getLeadstates",
                sort: "leadstate",
                dir: "ASC"
            },
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Tine.Crm.LeadState.Model,
            remoteSort: false
        });
        Ext.StoreMgr.add("CrmLeadstateStore", A)
    }
    return A
};
Tine.Crm.LeadState.EditStatesDialog = function(){
    var G = new Ext.ux.grid.CheckColumn({
        header: "X Lead?",
        dataIndex: "endslead",
        width: 50
    });
    var D = new Ext.grid.ColumnModel([{
        id: "leadstate_id",
        header: "id",
        dataIndex: "id",
        width: 25,
        hidden: true
    }, {
        id: "leadstate",
        header: "entries",
        dataIndex: "leadstate",
        width: 170,
        hideable: false,
        sortable: false,
        editor: new Ext.form.TextField({
            allowBlank: false
        })
    }, {
        id: "probability",
        header: "probability",
        dataIndex: "probability",
        width: 50,
        hideable: false,
        sortable: false,
        renderer: Ext.util.Format.percentage,
        editor: new Ext.form.ComboBox({
            name: "probability",
            id: "probability",
            hiddenName: "probability",
            store: new Ext.data.SimpleStore({
                fields: ["key", "value"],
                data: [[null, "none"], ["0", "0 %"], ["10", "10 %"], ["20", "20 %"], ["30", "30 %"], ["40", "40 %"], ["50", "50 %"], ["60", "60 %"], ["70", "70 %"], ["80", "80 %"], ["90", "90 %"], ["100", "100 %"]]
            }),
            displayField: "value",
            valueField: "key",
            allowBlank: true,
            editable: false,
            selectOnFocus: true,
            forceSelection: true,
            triggerAction: "all",
            mode: "local",
            lazyRender: true,
            listClass: "x-combo-list-small"
        })
    }, G]);
    var A = function(){
        var H = new Tine.Crm.LeadState.Model({
            id: null,
            leadstate: "",
            probability: null,
            endslead: false
        });
        C.stopEditing();
        Tine.Crm.LeadState.getStore().insert(0, H);
        C.startEditing(0, 0);
        C.fireEvent("celldblclick", this, 0, 1)
    };
    var F = function(){
        var J = Ext.getCmp("editLeadstateGrid");
        var H = J.getStore();
        var K = J.getSelectionModel().getSelections();
        for (var I = 0; I < K.length; ++I) {
            H.remove(K[I])
        }
    };
    var E = function(){
        var H = Ext.getCmp("editLeadstateGrid").getStore();
        var I = Tine.Tinebase.Common.getJSONdata(H);
        Ext.Ajax.request({
            params: {
                method: "Crm.saveLeadstates",
                optionsData: I
            },
            text: "Saving leadstates...",
            success: function(K, J){
                H.reload();
                H.rejectChanges();
                Ext.getCmp("filterLeadstate").store.reload()
            },
            failure: function(J, K){
            }
        })
    };
    var C = new Ext.grid.EditorGridPanel({
        store: Tine.Crm.LeadState.getStore(),
        id: "editLeadstateGrid",
        cm: D,
        autoExpandColumn: "leadstate",
        plugins: G,
        frame: false,
        viewConfig: {
            forceFit: true
        },
        sm: new Ext.grid.RowSelectionModel({
            multiSelect: true
        }),
        clicksToEdit: 2,
        tbar: [{
            text: "new item",
            iconCls: "actionAdd",
            handler: A
        }, {
            text: "delete item",
            iconCls: "actionDelete",
            handler: F
        }, {
            text: "save",
            iconCls: "actionSaveAndClose",
            handler: E
        }]
    });
    var B = new Ext.Window({
        title: "Leadstates",
        id: "leadstateWindow",
        modal: true,
        width: 350,
        height: 500,
        minWidth: 300,
        minHeight: 500,
        layout: "fit",
        plain: true,
        bodyStyle: "padding:5px;",
        buttonAlign: "center"
    });
    B.add(C);
    B.show()
};
Ext.namespace("Tine.Tasks", "Tine.Tasks.status");
Tine.Tasks.status.ComboBox = Ext.extend(Ext.form.ComboBox, {
    autoExpand: false,
    blurOnSelect: false,
    fieldLabel: "status",
    name: "status",
    displayField: "status_name",
    valueField: "id",
    mode: "local",
    triggerAction: "all",
    emptyText: "Status...",
    typeAhead: true,
    selectOnFocus: true,
    editable: false,
    lazyInit: false,
    initComponent: function(){
        this.store = Tine.Tasks.status.getStore();
        if (!this.value) {
            this.value = Tine.Tasks.status.getIdentifier("IN-PROCESS")
        }
        if (this.autoExpand) {
            this.on("focus", function(){
                this.lazyInit = false;
                this.expand()
            })
        }
        if (this.blurOnSelect) {
            this.on("select", function(){
                this.fireEvent("blur", this)
            }, this)
        }
        Tine.Tasks.status.ComboBox.superclass.initComponent.call(this)
    }
});
Tine.Tasks.status.getStore = function(){
    if (!A) {
        var A = new Ext.data.JsonStore({
            fields: [{
                name: "id"
            }, {
                name: "created_by"
            }, {
                name: "creation_time",
                type: "date",
                dateFormat: "c"
            }, {
                name: "last_modified_by"
            }, {
                name: "last_modified_time",
                type: "date",
                dateFormat: "c"
            }, {
                name: "is_deleted"
            }, {
                name: "deleted_time",
                type: "date",
                dateFormat: "c"
            }, {
                name: "deleted_by"
            }, {
                name: "status_name"
            }, {
                name: "status_is_open"
            }, {
                name: "status_icon"
            }],
            data: Tine.Tasks.AllStati,
            autoLoad: true,
            id: "id"
        })
    }
    return A
};
Tine.Tasks.status.getIdentifier = function(B){
    var C = Tine.Tasks.status.getStore().find("status_name", B);
    var A = Tine.Tasks.status.getStore().getAt(C);
    return A.data.id
};
Tine.Tasks.status.getStatus = function(B){
    var A = Tine.Tasks.status.getStore().getById(B);
    return A ? A : B
};
Tine.Tasks.status.getStatusIcon = function(B){
    var A = Tine.Tasks.status.getStatus(B);
    if (!A) {
        return
    }
    return '<img class="TasksMainGridStatus" src="' + A.data.status_icon + '" ext:qtip="' + A.data.status_name + '">'
};
Ext.namespace("Tine.Tasks");
Tine.Tasks.getPanel = function(){
    var A = Tine.Tasks.mainGrid.getTree();
    A.on("beforeexpand", function(B){
        Tine.Tasks.mainGrid.initComponent();
        Tine.Tinebase.MainScreen.setActiveToolbar(Tine.Tasks.mainGrid.getToolbar());
        Tine.Tinebase.MainScreen.setActiveContentPanel(Tine.Tasks.mainGrid.grid)
    }, this);
    return A
};
Tine.Tasks.mainGrid = {
    translation: null,
    tree: null,
    grid: null,
    sm: null,
    store: null,
    paging: {
        start: 0,
        limit: 50,
        sort: "due",
        dir: "ASC"
    },
    filter: {
        containerType: "personal",
        query: "",
        due: false,
        container: false,
        organizer: false,
        tag: false
    },
    handlers: {
        editInPopup: function(F, A){
            var D = -1;
            if (F.actionType == "edit") {
                var E = this.grid.getSelectionModel().getSelections();
                var B = E[0];
                D = B.data.id
            }
            else {
                var G = Ext.getCmp("TasksTreePanel").getSelectionModel().getSelectedNode().attributes ||
                {}
            }
            var C = new Tine.Tasks.EditPopup({
                id: D,
                containerId: (G && G.container) ? G.container.id : -1
            });
            C.on("update", function(H){
                this.store.load({
                    params: this.paging
                })
            }, this)
        },
        deleteTaks: function(B, A){
            Ext.MessageBox.confirm("Confirm", this.translation._("Do you really want to delete the selected task(s)"), function(F){
                if (F == "yes") {
                    var E = this.grid.getSelectionModel().getSelections();
                    if (E.length < 1) {
                        return
                    }
                    if (E.length > 1) {
                        var C = [];
                        for (var D = 0; D < E.length; D++) {
                            C.push(E[D].data.id)
                        }
                        var G = {
                            method: "Tasks.deleteTasks",
                            identifiers: Ext.util.JSON.encode(C)
                        }
                    }
                    else {
                        var G = {
                            method: "Tasks.deleteTask",
                            identifier: E[0].data.id
                        }
                    }
                    Ext.Ajax.request({
                        scope: this,
                        params: G,
                        success: function(I, H){
                            this.store.load({
                                params: this.paging
                            })
                        },
                        failure: function(H, I){
                            Ext.MessageBox.alert(this.translation._("Failed"), this.translation._("Could not delete task(s)."))
                        }
                    })
                }
            }, this)
        }
    },
    initComponent: function(){
        this.translation = new Locale.Gettext();
        this.translation.textdomain("Tasks");
        this.actions = {
            editInPopup: new Ext.Action({
                text: this.translation._("Edit task"),
                disabled: true,
                actionType: "edit",
                handler: this.handlers.editInPopup,
                iconCls: "action_edit",
                scope: this
            }),
            addInPopup: new Ext.Action({
                actionType: "add",
                text: this.translation._("Add task"),
                handler: this.handlers.editInPopup,
                iconCls: "TasksIconCls",
                scope: this
            }),
            deleteSingle: new Ext.Action({
                text: this.translation._("Delete task"),
                handler: this.handlers.deleteTaks,
                disabled: true,
                iconCls: "action_delete",
                scope: this
            }),
            deleteMultiple: new Ext.Action({
                text: this.translation._("Delete tasks"),
                handler: this.handlers.deleteTaks,
                disabled: true,
                iconCls: "action_delete",
                scope: this
            })
        };
        this.filter.owner = Tine.Tinebase.Registry.get("currentAccount").accountId;
        this.initStore();
        this.initGrid();
        this.updateMainToolbar()
    },
    initStore: function(){
        this.store = new Ext.data.JsonStore({
            idProperty: "id",
            root: "results",
            totalProperty: "totalcount",
            successProperty: "status",
            fields: Tine.Tasks.Task,
            remoteSort: true,
            baseParams: {
                method: "Tasks.searchTasks"
            },
            sortInfo: {
                field: "due",
                dir: "ASC"
            }
        });
        Ext.StoreMgr.add("TaskGridStore", this.store);
        this.store.on("beforeload", function(A, B){
            if (A.getSortState()) {
                this.filter.sort = A.getSortState().field;
                this.filter.dir = A.getSortState().direction
            }
            else {
                this.filter.sort = this.store.sort;
                this.filter.dir = this.store.dir
            }
            this.filter.start = B.params.start;
            this.filter.limit = B.params.limit;
            var C = Ext.getCmp("TasksTreePanel").getSelectionModel().getSelectedNode().attributes ||
            {};
            this.filter.containerType = C.containerType ? C.containerType : "all";
            this.filter.owner = C.owner ? C.owner.accountId : null;
            this.filter.container = C.container ? C.container.id : null;
            this.filter.showClosed = Ext.getCmp("TasksShowClosed") ? Ext.getCmp("TasksShowClosed").pressed : false;
            this.filter.organizer = Ext.getCmp("TasksorganizerFilter") ? Ext.getCmp("TasksorganizerFilter").getValue() : "";
            this.filter.query = Ext.getCmp("quickSearchField") ? Ext.getCmp("quickSearchField").getValue() : "";
            this.filter.status_id = Ext.getCmp("TasksStatusFilter") ? Ext.getCmp("TasksStatusFilter").getValue() : "";
            B.params.filter = Ext.util.JSON.encode(this.filter)
        }, this);
        this.store.on("update", function(C, B, A){
            switch (A) {
                case Ext.data.Record.EDIT:
                    Ext.Ajax.request({
                        scope: this,
                        params: {
                            method: "Tasks.saveTask",
                            task: Ext.util.JSON.encode(B.data),
                            linkingApp: "",
                            linkedId: ""
                        },
                        success: function(E, D){
                            C.commitChanges()
                        },
                        failure: function(D, E){
                            Ext.MessageBox.alert(this.translation._("Failed"), this.translation._("Could not save task."))
                        }
                    });
                    break;
                case Ext.data.Record.COMMIT:
                    break
            }
        }, this);
        this.store.load({
            params: this.paging
        })
    },
    updateMainToolbar: function(){
        var C = Ext.menu.MenuMgr.get("Tinebase_System_AdminMenu");
        C.removeAll();
        var B = Ext.getCmp("tineMenu").items.get("Tinebase_System_AdminButton");
        B.setIconClass("TasksTreePanel");
        B.setDisabled(true);
        var A = Ext.getCmp("tineMenu").items.get("Tinebase_System_PreferencesButton");
        A.setIconClass("TasksTreePanel");
        A.setDisabled(true)
    },
    getTree: function(){
        var A = new Locale.Gettext();
        A.textdomain("Tasks");
        this.tree = new Tine.widgets.container.TreePanel({
            id: "TasksTreePanel",
            iconCls: "TasksIconCls",
            title: A._("Tasks"),
            itemName: A._("to do lists"),
            folderName: "to do list",
            appName: "Tasks",
            border: false
        });
        this.tree.on("click", function(B){
            B.getOwnerTree().selectPath(B.getPath());
            this.store.load({
                params: this.paging
            })
        }, this);
        return this.tree
    },
    getToolbar: function(){
        var D = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 200,
            emptyText: this.translation._("Enter searchfilter")
        });
        D.on("change", function(F){
            if (this.filter.query != F.getValue()) {
                this.store.load({
                    params: this.paging
                })
            }
        }, this);
        var B = new Ext.Button({
            id: "TasksShowClosed",
            enableToggle: true,
            handler: function(){
                this.store.load({
                    params: this.paging
                })
            },
            scope: this,
            text: this.translation._("Show closed"),
            iconCls: "action_showArchived"
        });
        var E = new Ext.ux.form.ClearableComboBox({
            id: "TasksStatusFilter",
            hideLabel: true,
            store: Tine.Tasks.status.getStore(),
            displayField: "status_name",
            valueField: "id",
            typeAhead: true,
            mode: "local",
            triggerAction: "all",
            emptyText: "any",
            selectOnFocus: true,
            editable: false,
            width: 150
        });
        E.on("select", function(H, F, G){
            this.store.load({
                params: this.paging
            })
        }, this);
        var C = new Tine.widgets.AccountpickerField({
            id: "TasksorganizerFilter",
            width: 200,
            emptyText: "any"
        });
        C.on("select", function(H, F, G){
            this.store.load({
                params: this.paging
            })
        }, this);
        var A = new Ext.Toolbar({
            id: "Tasks_Toolbar",
            split: false,
            height: 26,
            items: [this.actions.addInPopup, this.actions.editInPopup, this.actions.deleteSingle, new Ext.Toolbar.Separator(), "->", B, new Ext.Toolbar.Separator(), "->", this.translation._("Search:"), " ", " ", D]
        });
        return A
    },
    initGrid: function(){
        var A = new Ext.PagingToolbar({
            pageSize: 50,
            store: this.store,
            displayInfo: true,
            displayMsg: this.translation._("Displaying tasks {0} - {1} of {2}"),
            emptyMsg: this.translation._("No tasks to display")
        });
        this.grid = new Ext.ux.grid.QuickaddGridPanel({
            id: "TasksMainGrid",
            border: false,
            store: this.store,
            tbar: A,
            clicksToEdit: "auto",
            enableColumnHide: false,
            enableColumnMove: false,
            region: "center",
            sm: new Ext.grid.RowSelectionModel(),
            loadMask: true,
            columns: [{
                id: "status_id",
                header: this.translation._("Status"),
                width: 45,
                sortable: true,
                dataIndex: "status_id",
                renderer: Tine.Tasks.status.getStatusIcon,
                editor: new Tine.Tasks.status.ComboBox({
                    autoExpand: true,
                    blurOnSelect: true,
                    listClass: "x-combo-list-small"
                }),
                quickaddField: new Tine.Tasks.status.ComboBox({
                    autoExpand: true
                })
            }, {
                id: "percent",
                header: this.translation._("Percent"),
                width: 50,
                sortable: true,
                dataIndex: "percent",
                renderer: Ext.ux.PercentRenderer,
                editor: new Ext.ux.PercentCombo({
                    autoExpand: true,
                    blurOnSelect: true
                }),
                quickaddField: new Ext.ux.PercentCombo({
                    autoExpand: true
                })
            }, {
                id: "summary",
                header: this.translation._("Summary"),
                width: 400,
                sortable: true,
                dataIndex: "summary",
                quickaddField: new Ext.form.TextField({
                    emptyText: this.translation._("Add a task...")
                })
            }, {
                id: "priority",
                header: this.translation._("Priority"),
                width: 45,
                sortable: true,
                dataIndex: "priority",
                renderer: Tine.widgets.Priority.renderer,
                editor: new Tine.widgets.Priority.Combo({
                    allowBlank: false,
                    autoExpand: true,
                    blurOnSelect: true
                }),
                quickaddField: new Tine.widgets.Priority.Combo({
                    autoExpand: true
                })
            }, {
                id: "due",
                header: this.translation._("Due Date"),
                width: 55,
                sortable: true,
                dataIndex: "due",
                renderer: Tine.Tinebase.Common.dateRenderer,
                editor: new Ext.ux.form.ClearableDateField({}),
                quickaddField: new Ext.ux.form.ClearableDateField({})
            }],
            quickaddMandatory: "summary",
            autoExpandColumn: "summary",
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                emptyText: this.translation._("No Tasks to display")
            })
        });
        this.grid.on("rowdblclick", function(B, D, C){
            this.handlers.editInPopup.call(this, {
                actionType: "edit"
            })
        }, this);
        this.grid.getSelectionModel().on("selectionchange", function(C){
            var B = C.getCount() != 1;
            this.actions.editInPopup.setDisabled(B);
            this.actions.deleteSingle.setDisabled(B);
            this.actions.deleteMultiple.setDisabled(!B)
        }, this);
        this.grid.on("rowcontextmenu", function(E, B, F){
            F.stopEvent();
            if (!E.getSelectionModel().isSelected(B)) {
                E.getSelectionModel().selectRow(B)
            }
            var G = E.getSelectionModel().getCount();
            var D = G > 1 ? [this.actions.deleteMultiple] : [this.actions.editInPopup, this.actions.deleteSingle, "-", this.actions.addInPopup];
            var C = new Ext.menu.Menu({
                items: D
            });
            C.showAt(F.getXY())
        }, this);
        this.grid.on("keydown", function(B){
            if (B.getKey() == B.DELETE && !this.grid.editing) {
                this.handlers.deleteTaks.call(this)
            }
        }, this);
        this.grid.on("newentry", function(C){
            var D = this.tree.getSelectionModel().getSelectedNode();
            C.container_id = D && D.attributes.container ? D.attributes.container.id : -1;
            var B = new Tine.Tasks.Task(C);
            Ext.Ajax.request({
                scope: this,
                params: {
                    method: "Tasks.saveTask",
                    task: Ext.util.JSON.encode(B.data),
                    linkingApp: "",
                    linkedId: ""
                },
                success: function(F, E){
                    Ext.StoreMgr.get("TaskGridStore").load({
                        params: this.paging
                    })
                },
                failure: function(E, F){
                    Ext.MessageBox.alert(this.translation._("Failed"), this.translation._("Could not save task."))
                }
            });
            return true
        }, this);
        this.grid.on("rowclick", function(C, F, D){
            var B = Ext.get(C.getView().getCell(F, 1));
            var E = B.child("div:last");
            while (B.first()) {
                B = B.first();
                B.on("click", function(G){
                    G.stopPropagation();
                    C.fireEvent("celldblclick", C, F, 1, G)
                })
            }
        }, this)
    }
};
Tine.Tasks.EditDialog = function(D){
    translation = new Locale.Gettext();
    translation.textdomain("Tasks");
    if (!arguments[0]) {
        D = {}
    }
    D = new Tine.Tasks.Task(D);
    Tine.Tasks.fixTask(D);
    var C = {
        applyChanges: function(I, F){
            var H = arguments[2] ? arguments[2] : false;
            var J = Ext.getCmp("TasksEditFormPanel");
            var G = J.getForm();
            G.render();
            if (G.isValid()) {
                Ext.MessageBox.wait(translation._("Please wait"), translation._("Saving Task"));
                G.updateRecord(D);
                Ext.Ajax.request({
                    params: {
                        method: "Tasks.saveTask",
                        task: Ext.util.JSON.encode(D.data),
                        linkingApp: formData.linking.link_app1,
                        linkedId: formData.linking.link_id1
                    },
                    success: function(L, K){
                        J.action_delete.enable();
                        D = new Tine.Tasks.Task(Ext.util.JSON.decode(L.responseText));
                        Tine.Tasks.fixTask(D);
                        G.loadRecord(D);
                        window.ParentEventProxy.fireEvent("update", D);
                        if (H) {
                            window.ParentEventProxy.purgeListeners();
                            window.setTimeout("window.close()", 1000)
                        }
                        else {
                            Ext.MessageBox.hide()
                        }
                    },
                    failure: function(K, L){
                        Ext.MessageBox.alert(translation._("Failed"), translation._("Could not save task."))
                    }
                })
            }
            else {
                Ext.MessageBox.alert(translation._("Errors"), translation._("Please fix the errors noted."))
            }
        },
        saveAndClose: function(G, F){
            C.applyChanges(G, F, true)
        },
        pre_delete: function(G, F){
            Ext.MessageBox.confirm(translation._("Confirm"), translation._("Do you really want to delete this task?"), function(H){
                if (H == "yes") {
                    Ext.MessageBox.wait(translation._("Please wait a moment..."), translation._("Saving Task"));
                    Ext.Ajax.request({
                        params: {
                            method: "Tasks.deleteTask",
                            identifier: D.data.id
                        },
                        success: function(J, I){
                            window.ParentEventProxy.fireEvent("update", D);
                            window.ParentEventProxy.purgeListeners();
                            window.setTimeout("window.close()", 1000)
                        },
                        failure: function(I, J){
                            Ext.MessageBox.alert(translation._("Failed"), translation._("Could not delete task(s)."));
                            Ext.MessageBox.hide()
                        }
                    })
                }
            })
        }
    };
    var B = {
        layout: "column",
        autoHeight: true,
        labelWidth: 90,
        border: false,
        items: [{
            columnWidth: 0.65,
            border: false,
            layout: "form",
            defaults: {
                anchor: "95%",
                xtype: "textfield"
            },
            items: [{
                fieldLabel: translation._("Summary"),
                hideLabel: true,
                xtype: "textfield",
                name: "summary",
                emptyText: translation._("Enter short name..."),
                allowBlank: false
            }, {
                fieldLabel: translation._("Notes"),
                hideLabel: true,
                emptyText: translation._("Enter description..."),
                name: "description",
                xtype: "textarea",
                height: 150
            }]
        }, {
            columnWidth: 0.35,
            border: false,
            layout: "form",
            defaults: {
                anchor: "95%"
            },
            items: [new Ext.ux.PercentCombo({
                fieldLabel: translation._("Percentage"),
                editable: false,
                name: "percent"
            }), new Tine.Tasks.status.ComboBox({
                fieldLabel: translation._("Status"),
                name: "status_id"
            }), new Tine.widgets.Priority.Combo({
                fieldLabel: translation._("Priority"),
                name: "priority"
            }), new Ext.ux.form.ClearableDateField({
                fieldLabel: translation._("Due date"),
                name: "due",
                format: "d.m.Y"
            }), new Tine.widgets.container.selectionComboBox({
                fieldLabel: translation._("Folder"),
                name: "container_id",
                itemName: "Tasks",
                appName: "Tasks"
            })]
        }]
    };
    var E = new Tine.widgets.dialog.EditRecord({
        id: "TasksEditFormPanel",
        handlerApplyChanges: C.applyChanges,
        handlerSaveAndClose: C.saveAndClose,
        handlerDelete: C.pre_delete,
        labelAlign: "side",
        items: B
    });
    var A = new Ext.Viewport({
        layout: "border",
        items: E
    });
    E.getForm().loadRecord(D);
    if (D.get("id") > 0) {
        E.action_delete.enable()
    }
};
Tine.Tasks.EditPopup = Ext.extend(Ext.ux.PopupWindow, {
    relatedApp: "",
    relatedId: -1,
    id: -1,
    containerId: -1,
    name: "TasksEditWindow",
    width: 700,
    height: 300,
    initComponent: function(){
        this.url = "index.php?method=Tasks.editTask&taskId=" + this.id + "&linkingApp=" + this.relatedApp + "&linkedId=" + this.relatedId + "&containerId=" + this.containerId;
        Tine.Tasks.EditPopup.superclass.initComponent.call(this)
    }
});
Tine.Tasks.fixTask = function(A){
    if (A.data.container_id) {
        A.data.container_id = Ext.util.JSON.decode(A.data.container_id)
    }
    if (A.data.due) {
        A.data.due = Date.parseDate(A.data.due, "c")
    }
};
Tine.Tasks.Task = Ext.data.Record.create([{
    name: "container_id"
}, {
    name: "created_by"
}, {
    name: "creation_time",
    type: "date",
    dateFormat: "c"
}, {
    name: "last_modified_by"
}, {
    name: "last_modified_time",
    type: "date",
    dateFormat: "c"
}, {
    name: "is_deleted"
}, {
    name: "deleted_time",
    type: "date",
    dateFormat: "c"
}, {
    name: "deleted_by"
}, {
    name: "id"
}, {
    name: "percent"
}, {
    name: "completed",
    type: "date",
    dateFormat: "c"
}, {
    name: "due",
    type: "date",
    dateFormat: "c"
}, {
    name: "class_id"
}, {
    name: "description"
}, {
    name: "geo"
}, {
    name: "location"
}, {
    name: "organizer"
}, {
    name: "priority"
}, {
    name: "status_id"
}, {
    name: "summary"
}, {
    name: "url"
}, {
    name: "attach"
}, {
    name: "attendee"
}, {
    name: "categories"
}, {
    name: "comment"
}, {
    name: "contact"
}, {
    name: "related"
}, {
    name: "resources"
}, {
    name: "rstatus"
}, {
    name: "dtstart",
    type: "date",
    dateFormat: "c"
}, {
    name: "duration",
    type: "date",
    dateFormat: "c"
}, {
    name: "recurid"
}, {
    name: "exdate"
}, {
    name: "exrule"
}, {
    name: "rdate"
}, {
    name: "rrule"
}]);
Ext.namespace("Tine.Admin");
Tine.Admin = function(){
    var A = [{
        text: "Accounts",
        cls: "treemain",
        allowDrag: false,
        allowDrop: true,
        id: "accounts",
        icon: false,
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: "accounts",
        viewRight: "accounts"
    }, {
        text: "Groups",
        cls: "treemain",
        allowDrag: false,
        allowDrop: true,
        id: "groupss",
        icon: false,
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: "groups",
        viewRight: "accounts"
    }, {
        text: "Applications",
        cls: "treemain",
        allowDrag: false,
        allowDrop: true,
        id: "applications",
        icon: false,
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: "applications",
        viewRight: "apps"
    }, {
        text: "Access Log",
        cls: "treemain",
        allowDrag: false,
        allowDrop: true,
        id: "accesslog",
        icon: false,
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: "accesslog",
        viewRight: "access_log"
    }, {
        text: "Shared Tags",
        cls: "treemain",
        iconCls: "action_tag",
        allowDrag: false,
        allowDrop: true,
        id: "sharedtags",
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: "sharedtags"
    }, {
        text: "Roles",
        cls: "treemain",
        iconCls: "action_permissions",
        allowDrag: false,
        allowDrop: true,
        id: "roles",
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: "roles",
        viewRight: "roles"
    }];
    var B = function(){
        var G = new Ext.tree.TreeLoader({
            dataUrl: "index.php",
            baseParams: {
                jsonKey: Tine.Tinebase.Registry.get("jsonKey"),
                method: "Admin.getSubTree",
                location: "mainTree"
            }
        });
        G.on("beforeload", function(I, H){
            I.baseParams.node = H.id
        }, this);
        var F = new Ext.tree.TreePanel({
            title: "Admin",
            id: "admin-tree",
            iconCls: "AdminIconCls",
            loader: G,
            rootVisible: false,
            border: false
        });
        var C = new Ext.tree.TreeNode({
            text: "root",
            draggable: false,
            allowDrop: false,
            id: "root"
        });
        F.setRootNode(C);
        for (var D = 0; D < A.length; D++) {
            var E = new Ext.tree.AsyncTreeNode(A[D]);
            if (A[D].viewRight && !Tine.Tinebase.hasRight("view", A[D].viewRight)) {
                E.disabled = true
            }
            C.appendChild(E)
        }
        F.on("click", function(I, H){
            if (I.disabled) {
                return false
            }
            var J = Tine.Tinebase.MainScreen.getActiveToolbar();
            switch (I.attributes.dataPanelType) {
                case "accesslog":
                    if (J !== false && J.id == "toolbarAdminAccessLog") {
                        Ext.getCmp("gridAdminAccessLog").getStore().load({
                            params: {
                                start: 0,
                                limit: 50
                            }
                        })
                    }
                    else {
                        Tine.Admin.AccessLog.Main.show()
                    }
                    break;
                case "accounts":
                    if (J !== false && J.id == "AdminAccountsToolbar") {
                        Ext.getCmp("AdminAccountsGrid").getStore().load({
                            params: {
                                start: 0,
                                limit: 50
                            }
                        })
                    }
                    else {
                        Tine.Admin.Accounts.Main.show()
                    }
                    break;
                case "groups":
                    if (J !== false && J.id == "AdminGroupsToolbar") {
                        Ext.getCmp("AdminGroupsGrid").getStore().load({
                            params: {
                                start: 0,
                                limit: 50
                            }
                        })
                    }
                    else {
                        Tine.Admin.Groups.Main.show()
                    }
                    break;
                case "applications":
                    if (J !== false && J.id == "toolbarAdminApplications") {
                        Ext.getCmp("gridAdminApplications").getStore().load({
                            params: {
                                start: 0,
                                limit: 50
                            }
                        })
                    }
                    else {
                        Tine.Admin.Applications.Main.show()
                    }
                    break;
                case "sharedtags":
                    if (J !== false && J.id == "AdminTagsToolbar") {
                        Ext.getCmp("AdminTagsGrid").getStore().load({
                            params: {
                                start: 0,
                                limit: 50
                            }
                        })
                    }
                    else {
                        Tine.Admin.Tags.Main.show()
                    }
                    break;
                case "roles":
                    if (J !== false && J.id == "AdminRolesToolbar") {
                        Ext.getCmp("AdminRolesGrid").getStore().load({
                            params: {
                                start: 0,
                                limit: 50
                            }
                        })
                    }
                    else {
                        Tine.Admin.Roles.Main.show()
                    }
                    break
            }
        }, this);
        F.on("beforeexpand", function(H){
            if (H.getSelectionModel().getSelectedNode() === null) {
                H.expandPath("/root");
                H.selectPath("/root/applications")
            }
            H.fireEvent("click", H.getSelectionModel().getSelectedNode())
        }, this);
        F.on("contextmenu", function(I, H){
            H.stopEvent()
        });
        return F
    };
    return {
        getPanel: B
    }
}
();
Ext.namespace("Tine.Admin.AccessLog");
Tine.Admin.AccessLog.Main = function(){
    var H = function(K, J){
        Ext.MessageBox.confirm("Confirm", "Do you really want to delete the selected access log entries?", function(N){
            if (N == "yes") {
                var O = new Array();
                var M = Ext.getCmp("gridAdminAccessLog").getSelectionModel().getSelections();
                for (var L = 0; L < M.length; ++L) {
                    O.push(M[L].id)
                }
                Ext.Ajax.request({
                    params: {
                        method: "Admin.deleteAccessLogEntries",
                        logIds: Ext.util.JSON.encode(O)
                    },
                    callback: function(Q, S, R){
                        if (S === true) {
                            var P = Ext.util.JSON.decode(R.responseText);
                            if (P.success === true) {
                                Ext.getCmp("gridAdminAccessLog").getStore().reload()
                            }
                        }
                    }
                })
            }
        })
    };
    var D = function(K, J){
        Ext.getCmp("gridAdminAccessLog").getSelectionModel().selectAll()
    };
    var C = new Ext.Action({
        text: "delete entry",
        disabled: true,
        handler: H,
        iconCls: "action_delete"
    });
    var B = new Ext.Action({
        text: "select all",
        handler: D
    });
    var G = new Ext.menu.Menu({
        items: [C, "-", B]
    });
    var A = function(){
        var J = new Ext.data.JsonStore({
            url: "index.php",
            baseParams: {
                method: "Admin.getAccessLogEntries"
            },
            root: "results",
            totalProperty: "totalcount",
            storeId: "adminApplications_accesslogStore",
            fields: [{
                name: "sessionid"
            }, {
                name: "login_name"
            }, {
                name: "accountObject"
            }, {
                name: "ip"
            }, {
                name: "li",
                type: "date",
                dateFormat: "c"
            }, {
                name: "lo",
                type: "date",
                dateFormat: "c"
            }, {
                name: "id"
            }, {
                name: "account_id"
            }, {
                name: "result"
            }],
            remoteSort: true
        });
        J.setDefaultSort("li", "desc");
        J.on("beforeload", function(K){
            K.baseParams.filter = Ext.getCmp("quickSearchField").getRawValue();
            var M = Date.parseDate(Ext.getCmp("adminApplications_dateFrom").getRawValue(), Ext.getCmp("adminApplications_dateFrom").format);
            K.baseParams.from = M.format("Y-m-d\\T00:00:00");
            var L = Date.parseDate(Ext.getCmp("adminApplications_dateTo").getRawValue(), Ext.getCmp("adminApplications_dateTo").format);
            K.baseParams.to = L.format("Y-m-d\\T23:59:59")
        });
        J.load({
            params: {
                start: 0,
                limit: 50
            }
        });
        return J
    };
    var E = function(){
        var N = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 200,
            emptyText: "enter searchfilter"
        });
        N.on("change", function(){
            Ext.getCmp("gridAdminAccessLog").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        });
        var K = new Date();
        var J = new Date(K.getTime() - 604800000);
        var O = new Ext.form.DateField({
            id: "adminApplications_dateFrom",
            allowBlank: false,
            validateOnBlur: false,
            format: Locale.getTranslationData("Date", "medium"),
            value: J
        });
        var M = new Ext.form.DateField({
            id: "adminApplications_dateTo",
            allowBlank: false,
            validateOnBlur: false,
            format: Locale.getTranslationData("Date", "medium"),
            value: K
        });
        var L = new Ext.Toolbar({
            id: "toolbarAdminAccessLog",
            split: false,
            height: 26,
            items: [C, "->", "Display from: ", " ", O, new Ext.Toolbar.Spacer(), "to: ", " ", M, new Ext.Toolbar.Spacer(), "-", "Search:", " ", " ", N]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(L);
        O.on("valid", function(Q){
            var P = Ext.StoreMgr.get("adminApplications_accesslogStore").baseParams.from;
            var S = Date.parseDate(Ext.getCmp("adminApplications_dateFrom").getRawValue(), Ext.getCmp("adminApplications_dateFrom").format);
            var R = Date.parseDate(Ext.getCmp("adminApplications_dateTo").getRawValue(), Ext.getCmp("adminApplications_dateTo").format);
            if (S.getTime() > R.getTime()) {
                Ext.getCmp("adminApplications_dateTo").setRawValue(Ext.getCmp("adminApplications_dateFrom").getRawValue())
            }
            if (P != S.format("Y-m-d\\T00:00:00")) {
                Ext.getCmp("gridAdminAccessLog").getStore().load({
                    params: {
                        start: 0,
                        limit: 50
                    }
                })
            }
        });
        M.on("valid", function(P){
            var Q = Ext.StoreMgr.get("adminApplications_accesslogStore").baseParams.to;
            var S = Date.parseDate(Ext.getCmp("adminApplications_dateFrom").getRawValue(), Ext.getCmp("adminApplications_dateFrom").format);
            var R = Date.parseDate(Ext.getCmp("adminApplications_dateTo").getRawValue(), Ext.getCmp("adminApplications_dateTo").format);
            if (S.getTime() > R.getTime()) {
                Ext.getCmp("adminApplications_dateFrom").setRawValue(Ext.getCmp("adminApplications_dateTo").getRawValue())
            }
            if (Q != R.format("Y-m-d\\T23:59:59")) {
                Ext.getCmp("gridAdminAccessLog").getStore().load({
                    params: {
                        start: 0,
                        limit: 50
                    }
                })
            }
        })
    };
    var I = function(K, P, N, J, L, M){
        var O;
        switch (K) {
            case "-3":
                O = "invalid password";
                break;
            case "-2":
                O = "ambiguous username";
                break;
            case "-1":
                O = "user not found";
                break;
            case "0":
                O = "failure";
                break;
            case "1":
                O = "success";
                break
        }
        return O
    };
    var F = function(){
        C.setDisabled(true);
        var J = A();
        var N = new Ext.PagingToolbar({
            pageSize: 50,
            store: J,
            displayInfo: true,
            displayMsg: "Displaying access log entries {0} - {1} of {2}",
            emptyMsg: "No access log entries to display"
        });
        var M = new Ext.grid.ColumnModel([{
            resizable: true,
            header: "Session ID",
            id: "sessionid",
            dataIndex: "sessionid",
            width: 200,
            hidden: true
        }, {
            resizable: true,
            header: "Login Name",
            id: "login_name",
            dataIndex: "login_name"
        }, {
            resizable: true,
            header: "Name",
            id: "accountObject",
            dataIndex: "accountObject",
            width: 170,
            sortable: false,
            renderer: Tine.Tinebase.Common.usernameRenderer
        }, {
            resizable: true,
            header: "IP Address",
            id: "ip",
            dataIndex: "ip",
            width: 150
        }, {
            resizable: true,
            header: "Login Time",
            id: "li",
            dataIndex: "li",
            width: 130,
            renderer: Tine.Tinebase.Common.dateTimeRenderer
        }, {
            resizable: true,
            header: "Logout Time",
            id: "lo",
            dataIndex: "lo",
            width: 130,
            renderer: Tine.Tinebase.Common.dateTimeRenderer
        }, {
            resizable: true,
            header: "Account ID",
            id: "account_id",
            dataIndex: "account_id",
            width: 70,
            hidden: true
        }, {
            resizable: true,
            header: "Result",
            id: "result",
            dataIndex: "result",
            width: 110,
            renderer: I
        }]);
        M.defaultSortable = true;
        var L = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        L.on("selectionchange", function(P){
            var O = P.getCount();
            if (O < 1) {
                C.setDisabled(true)
            }
            else {
                if (Tine.Tinebase.hasRight("manage", "access_log")) {
                    C.setDisabled(false)
                }
            }
        });
        var K = new Ext.grid.GridPanel({
            id: "gridAdminAccessLog",
            store: J,
            cm: M,
            tbar: N,
            autoSizeColumns: false,
            selModel: L,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "login_name",
            border: false
        });
        Tine.Tinebase.MainScreen.setActiveContentPanel(K);
        K.on("rowcontextmenu", function(P, O, Q){
            Q.stopEvent();
            if (!P.getSelectionModel().isSelected(O)) {
                P.getSelectionModel().selectRow(O);
                C.setDisabled(false)
            }
            G.showAt(Q.getXY())
        })
    };
    return {
        show: function(){
            E();
            F();
            this.updateMainToolbar()
        },
        updateMainToolbar: function(){
            var L = Ext.menu.MenuMgr.get("Tinebase_System_AdminMenu");
            L.removeAll();
            var K = Ext.getCmp("tineMenu").items.get("Tinebase_System_AdminButton");
            K.setIconClass("AdminTreePanel");
            K.setDisabled(true);
            var J = Ext.getCmp("tineMenu").items.get("Tinebase_System_PreferencesButton");
            J.setIconClass("AdminTreePanel");
            J.setDisabled(true)
        }
    }
}
();
Ext.namespace("Tine.Admin.Applications");
Tine.Admin.Applications.Main = function(){
    var D = function(L, J){
        var K = Ext.getCmp("gridAdminApplications").getSelectionModel().getSelections();
        var M = K[0].id;
        Tine.Tinebase.Common.openWindow("applicationWindow", "index.php?method=Admin.editApplication&appId=" + M, 600, 400)
    };
    var B = function(O, J){
        var M = "disabled";
        if (O.id == "Admin_Accesslog_Action_Enable") {
            M = "enabled"
        }
        var L = new Array();
        var N = Ext.getCmp("gridAdminApplications").getSelectionModel().getSelections();
        for (var K = 0; K < N.length; ++K) {
            L.push(N[K].id)
        }
        Ext.Ajax.request({
            url: "index.php",
            method: "post",
            params: {
                method: "Admin.setApplicationState",
                applicationIds: Ext.util.JSON.encode(L),
                state: M
            },
            callback: function(Q, S, R){
                if (S === true) {
                    var P = Ext.util.JSON.decode(R.responseText);
                    if (P.success === true) {
                        Ext.getCmp("gridAdminApplications").getStore().reload()
                    }
                }
            }
        })
    };
    var C = new Ext.Action({
        text: "enable application",
        disabled: true,
        handler: B,
        iconCls: "action_enable",
        id: "Admin_Accesslog_Action_Enable"
    });
    var G = new Ext.Action({
        text: "disable application",
        disabled: true,
        handler: B,
        iconCls: "action_disable",
        id: "Admin_Accesslog_Action_Disable"
    });
    var F = new Ext.Action({
        text: "settings",
        disabled: true,
        handler: D,
        iconCls: "action_settings"
    });
    var H = function(){
        var J = new Ext.data.JsonStore({
            url: "index.php",
            baseParams: {
                method: "Admin.getApplications"
            },
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: [{
                name: "id"
            }, {
                name: "name"
            }, {
                name: "status"
            }, {
                name: "order"
            }, {
                name: "app_tables"
            }, {
                name: "version"
            }],
            remoteSort: true
        });
        J.setDefaultSort("name", "asc");
        J.on("beforeload", function(K){
            K.baseParams.filter = Ext.getCmp("quickSearchField").getRawValue()
        });
        J.load({
            params: {
                start: 0,
                limit: 50
            }
        });
        return J
    };
    var I = function(){
        var K = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 240,
            emptyText: "enter searchfilter"
        });
        K.on("change", function(){
            Ext.getCmp("gridAdminApplications").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        });
        var J = new Ext.Toolbar({
            id: "toolbarAdminApplications",
            split: false,
            height: 26,
            items: [C, G, "-", F, "->", "Search:", " ", " ", K]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(J)
    };
    var A = function(K, P, N, J, L, M){
        var O;
        switch (K) {
            case "disabled":
            case "enabled":
                O = K;
                break;
            default:
                O = "unknown status (" + K + ")";
                break
        }
        return O
    };
    var E = function(){
        var L = new Ext.menu.Menu({
            items: [C, G, G]
        });
        var J = H();
        var N = new Ext.PagingToolbar({
            pageSize: 50,
            store: J,
            displayInfo: true,
            displayMsg: "Displaying application {0} - {1} of {2}",
            emptyMsg: "No applications to display"
        });
        var O = new Ext.grid.ColumnModel([{
            resizable: true,
            header: "order",
            id: "order",
            dataIndex: "order",
            width: 50
        }, {
            resizable: true,
            header: "name",
            id: "name",
            dataIndex: "name"
        }, {
            resizable: true,
            header: "status",
            id: "status",
            dataIndex: "status",
            width: 150,
            renderer: A
        }, {
            resizable: true,
            header: "version",
            id: "version",
            dataIndex: "version",
            width: 70
        }]);
        O.defaultSortable = true;
        var K = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        K.on("selectionchange", function(R){
            var P = R.getCount();
            var Q = R.getSelected();
            if (Tine.Tinebase.hasRight("manage", "apps")) {
                if (P < 1) {
                    C.setDisabled(true);
                    G.setDisabled(true);
                    F.setDisabled(true)
                }
                else {
                    if (P > 1) {
                        C.setDisabled(false);
                        G.setDisabled(false);
                        F.setDisabled(true)
                    }
                    else {
                        if (Q.data.name == "Tinebase") {
                            C.setDisabled(true);
                            G.setDisabled(true);
                            F.setDisabled(true)
                        }
                        else {
                            C.setDisabled(false);
                            G.setDisabled(false);
                            F.setDisabled(true)
                        }
                    }
                }
            }
        });
        var M = new Ext.grid.GridPanel({
            id: "gridAdminApplications",
            store: J,
            cm: O,
            tbar: N,
            autoSizeColumns: false,
            selModel: K,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "name",
            border: false
        });
        Tine.Tinebase.MainScreen.setActiveContentPanel(M);
        M.on("rowcontextmenu", function(Q, P, R){
            R.stopEvent();
            if (!Q.getSelectionModel().isSelected(P)) {
                Q.getSelectionModel().selectRow(P);
                if (Tine.Tinebase.hasRight("manage", "apps")) {
                    C.setDisabled(false);
                    G.setDisabled(false);
                    F.setDisabled(true)
                }
            }
            L.showAt(R.getXY())
        }, this);
        return
    };
    return {
        show: function(){
            I();
            E();
            this.updateMainToolbar()
        },
        updateMainToolbar: function(){
            var L = Ext.menu.MenuMgr.get("Tinebase_System_AdminMenu");
            L.removeAll();
            var K = Ext.getCmp("tineMenu").items.get("Tinebase_System_AdminButton");
            K.setIconClass("AdminTreePanel");
            K.setDisabled(true);
            var J = Ext.getCmp("tineMenu").items.get("Tinebase_System_PreferencesButton");
            J.setIconClass("AdminTreePanel");
            J.setDisabled(true)
        }
    }
}
();
Tine.Admin.Applications.EditPermissionsDialog = {
    applicationRecord: null,
    applicationRecordRights: null,
    getRecordIndex: function(B, A){
        var C = false;
        A.each(function(D){
            if ((D.data.account_type == "user" || D.data.account_type == "account") && B.data.type == "user" && D.data.account_id == B.data.id) {
                C = D.id
            }
            else {
                if (D.data.account_type == "group" && B.data.type == "group" && D.data.account_id == B.data.id) {
                    C = D.id
                }
            }
        });
        return C ? A.indexOfId(C) : false
    },
    loadDataStore: function(C, E){
        var D = [];
        for (var A = 0; A < E.length; A++) {
            D.push({
                name: E[A]
            })
        }
        this.applicationRecordRights = Ext.data.Record.create([{
            name: "id"
        }, {
            name: "account_id"
        }, {
            name: "account_type"
        }, {
            name: "accountDisplayName"
        }, ].concat(D));
        this.dataStore = new Ext.data.JsonStore({
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: this.applicationRecordRights
        });
        Ext.StoreMgr.add("ApplicationRightsStore", this.dataStore);
        this.dataStore.setDefaultSort("accountDisplayName", "asc");
        var B = false;
        for (var A = 0; A < C.results.length; A++) {
            if (C.results[A].account_type === "anyone") {
                B = true
            }
        }
        if (!B) {
            C.results.push({
                accountDisplayName: "Anyone",
                account_type: "anyone"
            })
        }
        this.dataStore.loadData(C)
    },
    handlers: {
        removeAccount: function(E, A){
            var C = Ext.getCmp("accountRightsGrid");
            var D = C.getSelectionModel().getSelections();
            var F = this.dataStore;
            for (var B = 0; B < D.length; ++B) {
                F.remove(D[B])
            }
        },
        addAccount: function(F){
            var E = Ext.getCmp("accountRightsGrid");
            var D = E.getStore();
            var A = E.getSelectionModel();
            var C = Tine.Admin.Applications.EditPermissionsDialog.getRecordIndex(F, D);
            if (C === false) {
                var B = new Ext.data.Record({
                    account_id: F.data.id,
                    account_type: F.data.type,
                    accountDisplayName: F.data.name
                }, F.data.id);
                D.addSorted(B)
            }
            A.selectRow(D.indexOfId(F.data.account_id))
        },
        applyChanges: function(F, B, A){
            Ext.MessageBox.wait("Please wait", "Updating Rights");
            var G = Ext.getCmp("adminApplicationEditPermissionsDialog");
            var D = Ext.getCmp("accountRightsGrid");
            var C = D.getStore();
            var E = [];
            C.each(function(H){
                E.push(H.data)
            });
            Ext.Ajax.request({
                params: {
                    method: "Admin.saveApplicationPermissions",
                    applicationId: G.applicationId,
                    rights: Ext.util.JSON.encode(E)
                },
                success: function(I, H){
                    if (A === true) {
                        window.close()
                    }
                    else {
                        Ext.MessageBox.hide()
                    }
                },
                failure: function(H, I){
                    Ext.MessageBox.alert("Failed", "Could not save group.")
                },
                scope: this
            })
        },
        saveAndClose: function(B, A){
            this.handlers.applyChanges(B, A, true)
        }
    },
    display: function(H, B, K){
        this.applicationId = H.id;
        this.actions = {
            addAccount: new Ext.Action({
                text: "add account",
                disabled: true,
                scope: this,
                handler: this.handlers.addAccount,
                iconCls: "action_addContact"
            }),
            removeAccount: new Ext.Action({
                text: "remove account",
                disabled: true,
                scope: this,
                handler: this.handlers.removeAccount,
                iconCls: "action_deleteContact"
            })
        };
        var L = new Tine.widgets.account.PickerPanel({
            enableBbar: true,
            region: "west",
            selectType: "both",
            height: 300,
            selectAction: function(){
                this.account = account;
                this.handlers.addAccount(account)
            },
            border: true
        });
        L.on("accountdblclick", function(N){
            this.account = N;
            this.handlers.addAccount(N)
        }, this);
        this.loadDataStore(B, K);
        var C = [];
        for (var F = 0; F < K.length; F++) {
            var E = (K[F].length > 7) ? K[F].length * 8 : 55;
            C.push(new Ext.ux.grid.CheckColumn({
                header: K[F],
                dataIndex: K[F],
                width: E
            }))
        }
        var G = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "accountDisplayName",
            header: "Name",
            dataIndex: "accountDisplayName",
            width: 70
        }].concat(C));
        G.defaultSortable = true;
        var M = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        var A = new Ext.Toolbar({
            items: [this.actions.removeAccount]
        });
        M.on("selectionchange", function(O){
            var N = O.getCount();
            if (N < 1) {
                this.actions.removeAccount.setDisabled(true)
            }
            else {
                this.actions.removeAccount.setDisabled(false)
            }
        }, this);
        this.RightsGridPanel = new Ext.grid.EditorGridPanel({
            id: "accountRightsGrid",
            region: "center",
            title: "Account permissions for " + H.name + "",
            store: this.dataStore,
            cm: G,
            autoSizeColumns: false,
            selModel: M,
            enableColLock: false,
            loadMask: true,
            plugins: C,
            autoExpandColumn: "accountDisplayName",
            bbar: A,
            border: false,
            height: 300,
            border: true
        });
        var D = {
            layout: "column",
            border: false,
            width: 600,
            height: 500,
            items: [L, this.RightsGridPanel]
        };
        var J = new Tine.widgets.dialog.EditRecord({
            id: "adminApplicationEditPermissionsDialog",
            layout: "fit",
            labelWidth: 120,
            labelAlign: "top",
            handlerScope: this,
            handlerApplyChanges: this.handlers.applyChanges,
            handlerSaveAndClose: this.handlers.saveAndClose,
            items: D,
            applicationId: H.id
        });
        var I = new Ext.Viewport({
            layout: "border",
            frame: true,
            items: J
        })
    }
};
Ext.namespace("Tine.Admin.Accounts");
Tine.Admin.Accounts.Main = function(){
    var A = function(){
        var C = new Ext.data.JsonStore({
            baseParams: {
                method: "Admin.getAccounts"
            },
            root: "results",
            totalProperty: "totalcount",
            id: "accountId",
            fields: Tine.Admin.Accounts.Account,
            remoteSort: true
        });
        C.setDefaultSort("accountLoginName", "asc");
        C.on("beforeload", function(D){
            D.baseParams.filter = Ext.getCmp("quickSearchField").getRawValue()
        });
        C.load({
            params: {
                start: 0,
                limit: 50
            }
        });
        return C
    };
    var B = function(D, I, G, C, E, F){
        var H;
        switch (D) {
            case "enabled":
                H = "<img src='images/oxygen/16x16/actions/dialog-apply.png' width='12' height='12'/>";
                break;
            case "disabled":
                H = "<img src='images/oxygen/16x16/actions/dialog-cancel.png' width='12' height='12'/>";
                break;
            default:
                H = D;
                break
        }
        return H
    };
    return {
        show: function(){
            this.initComponent();
            this.showToolbar();
            this.showMainGrid();
            this.updateMainToolbar()
        },
        updateMainToolbar: function(){
            var E = Ext.menu.MenuMgr.get("Tinebase_System_AdminMenu");
            E.removeAll();
            var D = Ext.getCmp("tineMenu").items.get("Tinebase_System_AdminButton");
            D.setIconClass("AdminTreePanel");
            D.setDisabled(true);
            var C = Ext.getCmp("tineMenu").items.get("Tinebase_System_PreferencesButton");
            C.setIconClass("AdminTreePanel");
            C.setDisabled(true)
        },
        openAccountEditWindow: function(D){
            var C = (D ? D : "");
            Tine.Tinebase.Common.openWindow("accountEditWindow", "index.php?method=Admin.editAccountDialog&accountId=" + C, 800, 450)
        },
        addButtonHandler: function(D, C){
            Tine.Admin.Accounts.Main.openAccountEditWindow()
        },
        editButtonHandler: function(E, C){
            var D = Ext.getCmp("AdminAccountsGrid").getSelectionModel().getSelections();
            var F = D[0].id;
            Tine.Admin.Accounts.Main.openAccountEditWindow(F)
        },
        enableDisableButtonHandler: function(H, D){
            var C = "disabled";
            if (H.id == "Admin_Accounts_Action_Enable") {
                C = "enabled"
            }
            var E = new Array();
            var G = Ext.getCmp("AdminAccountsGrid").getSelectionModel().getSelections();
            for (var F = 0; F < G.length; ++F) {
                E.push(G[F].id)
            }
            Ext.Ajax.request({
                url: "index.php",
                method: "post",
                params: {
                    method: "Admin.setAccountState",
                    accountIds: Ext.util.JSON.encode(E),
                    status: C
                },
                callback: function(J, L, K){
                    if (L === true) {
                        var I = Ext.util.JSON.decode(K.responseText);
                        if (I.success === true) {
                            Ext.getCmp("AdminAccountsGrid").getStore().reload()
                        }
                    }
                }
            })
        },
        resetPasswordHandler: function(D, C){
            Ext.MessageBox.prompt("Set new password", "Please enter the new password:", function(G, F){
                if (G == "ok") {
                    var E = Ext.util.JSON.encode(Ext.getCmp("AdminAccountsGrid").getSelectionModel().getSelected().data);
                    Ext.Ajax.request({
                        params: {
                            method: "Admin.resetPassword",
                            account: E,
                            password: F
                        },
                        callback: function(I, K, J){
                            if (K === true) {
                                var H = Ext.util.JSON.decode(J.responseText);
                                if (H.success === true) {
                                    Ext.getCmp("AdminAccountsGrid").getStore().reload()
                                }
                            }
                        }
                    })
                }
            })
        },
        deleteButtonHandler: function(D, C){
            Ext.MessageBox.confirm("Confirm", "Do you really want to delete the selected account(s)?", function(G){
                if (G == "yes") {
                    var E = new Array();
                    var H = Ext.getCmp("AdminAccountsGrid").getSelectionModel().getSelections();
                    for (var F = 0; F < H.length; ++F) {
                        E.push(H[F].id)
                    }
                    Ext.Ajax.request({
                        url: "index.php",
                        params: {
                            method: "Admin.deleteAccounts",
                            accountIds: Ext.util.JSON.encode(E)
                        },
                        text: "Deleting account(s)...",
                        success: function(J, I){
                            Ext.getCmp("AdminAccountsGrid").getStore().reload()
                        },
                        failure: function(I, J){
                            Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the account(s).")
                        }
                    })
                }
            })
        },
        actionEnable: null,
        actionDisable: null,
        actionResetPassword: null,
        actionAddAccount: null,
        actionEditAccount: null,
        actionDeleteAccount: null,
        showToolbar: function(){
            var D = new Ext.ux.SearchField({
                id: "quickSearchField",
                width: 240,
                emptyText: "enter searchfilter"
            });
            D.on("change", function(){
                Ext.getCmp("AdminAccountsGrid").getStore().load({
                    params: {
                        start: 0,
                        limit: 50
                    }
                })
            });
            var C = new Ext.Toolbar({
                id: "AdminAccountsToolbar",
                split: false,
                height: 26,
                items: [this.actionAddAccount, this.actionEditAccount, this.actionDeleteAccount, "-", "->", "Search:", " ", " ", D]
            });
            Tine.Tinebase.MainScreen.setActiveToolbar(C)
        },
        showMainGrid: function(){
            if (Tine.Tinebase.hasRight("manage", "accounts")) {
                this.actionAddAccount.setDisabled(false)
            }
            var G = new Ext.menu.Menu({
                items: [this.actionEditAccount, this.actionEnable, this.actionDisable, this.actionResetPassword, this.actionDeleteAccount, "-", this.actionAddAccount]
            });
            var C = A();
            var H = new Ext.PagingToolbar({
                pageSize: 50,
                store: C,
                displayInfo: true,
                displayMsg: "Displaying accounts {0} - {1} of {2}",
                emptyMsg: "No accounts to display"
            });
            var F = new Ext.grid.ColumnModel([{
                resizable: true,
                header: "ID",
                id: "accountId",
                dataIndex: "accountId",
                hidden: true,
                width: 50
            }, {
                resizable: true,
                header: "Status",
                id: "accountStatus",
                dataIndex: "accountStatus",
                width: 50,
                renderer: B
            }, {
                resizable: true,
                header: "Displayname",
                id: "accountDisplayName",
                dataIndex: "accountDisplayName"
            }, {
                resizable: true,
                header: "Loginname",
                id: "accountLoginName",
                dataIndex: "accountLoginName"
            }, {
                resizable: true,
                header: "Last name",
                id: "accountLastName",
                dataIndex: "accountLastName",
                hidden: true
            }, {
                resizable: true,
                header: "First name",
                id: "accountFirstName",
                dataIndex: "accountFirstName",
                hidden: true
            }, {
                resizable: true,
                header: "Email",
                id: "accountEmailAddress",
                dataIndex: "accountEmailAddress",
                width: 200
            }, {
                resizable: true,
                header: "Last login at",
                id: "accountLastLogin",
                dataIndex: "accountLastLogin",
                width: 130,
                renderer: Tine.Tinebase.Common.dateTimeRenderer
            }, {
                resizable: true,
                header: "Last login from",
                id: "accountLastLoginfrom",
                dataIndex: "accountLastLoginfrom"
            }, {
                resizable: true,
                header: "Password changed",
                id: "accountLastPasswordChange",
                dataIndex: "accountLastPasswordChange",
                width: 130,
                renderer: Tine.Tinebase.Common.dateTimeRenderer
            }, {
                resizable: true,
                header: "Expires",
                id: "accountExpires",
                dataIndex: "accountExpires",
                width: 130,
                renderer: Tine.Tinebase.Common.dateTimeRenderer
            }]);
            F.defaultSortable = true;
            var E = new Ext.grid.RowSelectionModel({
                multiSelect: true
            });
            E.on("selectionchange", function(J){
                var I = J.getCount();
                if (Tine.Tinebase.hasRight("manage", "accounts")) {
                    if (I < 1) {
                        this.actionEditAccount.setDisabled(true);
                        this.actionDeleteAccount.setDisabled(true);
                        this.actionEnable.setDisabled(true);
                        this.actionDisable.setDisabled(true);
                        this.actionResetPassword.setDisabled(true)
                    }
                    else {
                        if (I > 1) {
                            this.actionEditAccount.setDisabled(true);
                            this.actionDeleteAccount.setDisabled(false);
                            this.actionEnable.setDisabled(false);
                            this.actionDisable.setDisabled(false);
                            this.actionResetPassword.setDisabled(true)
                        }
                        else {
                            this.actionEditAccount.setDisabled(false);
                            this.actionDeleteAccount.setDisabled(false);
                            this.actionEnable.setDisabled(false);
                            this.actionDisable.setDisabled(false);
                            this.actionResetPassword.setDisabled(false)
                        }
                    }
                }
            }, this);
            var D = new Ext.grid.GridPanel({
                id: "AdminAccountsGrid",
                store: C,
                cm: F,
                tbar: H,
                autoSizeColumns: false,
                selModel: E,
                enableColLock: false,
                loadMask: true,
                autoExpandColumn: "accountDisplayName",
                border: false
            });
            Tine.Tinebase.MainScreen.setActiveContentPanel(D);
            D.on("rowcontextmenu", function(J, I, K){
                K.stopEvent();
                if (!J.getSelectionModel().isSelected(I)) {
                    J.getSelectionModel().selectRow(I);
                    this.actionEnable.setDisabled(false);
                    this.actionDisable.setDisabled(false)
                }
                G.showAt(K.getXY())
            }, this);
            D.on("rowdblclick", function(J, K, L){
                var I = J.getStore().getAt(K);
                try {
                    Tine.Admin.Accounts.Main.openAccountEditWindow(I.id)
                } 
                catch (M) {
                }
            });
            D.on("keydown", function(I){
                if (I.getKey() == I.DELETE && Ext.getCmp("AdminAccountsGrid").getSelectionModel().getCount() > 0) {
                    this.deleteButtonHandler()
                }
            }, this)
        },
        initComponent: function(){
            this.actionAddAccount = new Ext.Action({
                text: "add account",
                disabled: true,
                handler: this.addButtonHandler,
                iconCls: "action_addContact",
                scope: this
            });
            this.actionEditAccount = new Ext.Action({
                text: "edit account",
                disabled: true,
                handler: this.editButtonHandler,
                iconCls: "action_edit",
                scope: this
            });
            this.actionDeleteAccount = new Ext.Action({
                text: "delete account",
                disabled: true,
                handler: this.deleteButtonHandler,
                iconCls: "action_delete",
                scope: this
            });
            this.actionEnable = new Ext.Action({
                text: "enable account",
                disabled: true,
                handler: this.enableDisableButtonHandler,
                iconCls: "action_enable",
                id: "Admin_Accounts_Action_Enable",
                scope: this
            });
            this.actionDisable = new Ext.Action({
                text: "disable account",
                disabled: true,
                handler: this.enableDisableButtonHandler,
                iconCls: "action_disable",
                id: "Admin_Accounts_Action_Disable",
                scope: this
            });
            this.actionResetPassword = new Ext.Action({
                text: "reset password",
                disabled: true,
                handler: this.resetPasswordHandler,
                id: "Admin_Accounts_Action_resetPassword",
                scope: this
            })
        },
        reload: function(){
            if (Ext.ComponentMgr.all.containsKey("AdminAccountsGrid")) {
                setTimeout("Ext.getCmp('AdminAccountsGrid').getStore().reload()", 200)
            }
        }
    }
}
();
Tine.Admin.Accounts.EditDialog = function(){
    return {
        accountRecord: null,
        updateAccountRecord: function(A){
            if (A.accountExpires && A.accountExpires !== null) {
                A.accountExpires = Date.parseDate(A.accountExpires, "c")
            }
            if (A.accountLastLogin && A.accountLastLogin !== null) {
                A.accountLastLogin = Date.parseDate(A.accountLastLogin, "c")
            }
            if (A.accountLastPasswordChange && A.accountLastPasswordChange !== null) {
                A.accountLastPasswordChange = Date.parseDate(A.accountLastPasswordChange, "c")
            }
            if (!A.accountPassword) {
                A.accountPassword = null
            }
            this.accountRecord = new Tine.Admin.Accounts.Account(A)
        },
        deleteAccount: function(C, A){
            var B = Ext.util.JSON.encode([this.accountRecord.get("accountId")]);
            Ext.Ajax.request({
                url: "index.php",
                params: {
                    method: "Admin.deleteAccounts",
                    accountIds: B
                },
                text: "Deleting account...",
                success: function(E, D){
                    window.opener.Tine.Admin.Accounts.Main.reload();
                    window.close()
                },
                failure: function(D, E){
                    Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the account.")
                }
            })
        },
        applyChanges: function(D, B, A){
            var C = Ext.getCmp("admin_editAccountForm").getForm();
            if (C.isValid()) {
                C.updateRecord(this.accountRecord);
                if (this.accountRecord.data.accountFirstName) {
                    this.accountRecord.data.accountFullName = this.accountRecord.data.accountFirstName + " " + this.accountRecord.data.accountLastName;
                    this.accountRecord.data.accountDisplayName = this.accountRecord.data.accountLastName + ", " + this.accountRecord.data.accountFirstName
                }
                else {
                    this.accountRecord.data.accountFullName = this.accountRecord.data.accountLastName;
                    this.accountRecord.data.accountDisplayName = this.accountRecord.data.accountLastName
                }
                Ext.Ajax.request({
                    params: {
                        method: "Admin.saveAccount",
                        accountData: Ext.util.JSON.encode(this.accountRecord.data),
                        password: C.findField("accountPassword").getValue(),
                        passwordRepeat: C.findField("accountPassword2").getValue()
                    },
                    success: function(F, E){
                        if (window.opener.Tine.Admin.Accounts) {
                            window.opener.Tine.Admin.Accounts.Main.reload()
                        }
                        if (A === true) {
                            window.close()
                        }
                        else {
                            this.updateAccountRecord(Ext.util.JSON.decode(F.responseText));
                            this.updateToolbarButtons();
                            C.loadRecord(this.accountRecord)
                        }
                    },
                    failure: function(E, F){
                        Ext.MessageBox.alert("Failed", "Could not save account.")
                    },
                    scope: this
                })
            }
            else {
                Ext.MessageBox.alert("Errors", "Please fix the errors noted.")
            }
        },
        saveChanges: function(B, A){
            this.applyChanges(B, A, true)
        },
        editAccountDialog: [{
            layout: "column",
            border: false,
            autoHeight: true,
            items: [{
                columnWidth: 0.6,
                border: false,
                layout: "form",
                defaults: {
                    anchor: "95%"
                },
                items: [{
                    xtype: "textfield",
                    fieldLabel: "First Name",
                    name: "accountFirstName"
                }, {
                    xtype: "textfield",
                    fieldLabel: "Last Name",
                    name: "accountLastName",
                    allowBlank: false
                }, {
                    xtype: "textfield",
                    fieldLabel: "Login Name",
                    name: "accountLoginName",
                    allowBlank: false
                }, {
                    xtype: "textfield",
                    fieldLabel: "Password",
                    name: "accountPassword",
                    inputType: "password",
                    emptyText: "no password set"
                }, {
                    xtype: "textfield",
                    fieldLabel: "Password again",
                    name: "accountPassword2",
                    inputType: "password",
                    emptyText: "no password set"
                }, new Tine.widgets.group.selectionComboBox({
                    fieldLabel: "Primary group",
                    name: "accountPrimaryGroup",
                    displayField: "name",
                    valueField: "id"
                }), {
                    xtype: "textfield",
                    vtype: "email",
                    fieldLabel: "Emailaddress",
                    name: "accountEmailAddress"
                }]
            }, {
                columnWidth: 0.4,
                border: false,
                layout: "form",
                defaults: {
                    anchor: "95%"
                },
                items: [{
                    xtype: "combo",
                    fieldLabel: "Status",
                    name: "accountStatus",
                    mode: "local",
                    displayField: "status",
                    valueField: "key",
                    triggerAction: "all",
                    allowBlank: false,
                    editable: false,
                    store: new Ext.data.SimpleStore({
                        fields: ["key", "status"],
                        data: [["enabled", "enabled"], ["disabled", "disabled"]]
                    })
                }, new Ext.ux.form.ClearableDateField({
                    fieldLabel: "Expires",
                    name: "accountExpires",
                    format: "d.m.Y",
                    emptyText: "never"
                }), {
                    xtype: "datefield",
                    fieldLabel: "Last login at",
                    name: "accountLastLogin",
                    format: "d.m.Y H:i:s",
                    emptyText: "never logged in",
                    hideTrigger: true,
                    readOnly: true
                }, {
                    xtype: "textfield",
                    fieldLabel: "Last login from",
                    name: "accountLastLoginfrom",
                    emptyText: "never logged in",
                    readOnly: true
                }, {
                    xtype: "datefield",
                    fieldLabel: "Password set",
                    name: "accountLastPasswordChange",
                    format: "d.m.Y H:i:s",
                    emptyText: "never",
                    hideTrigger: true,
                    readOnly: true
                }]
            }]
        }],
        updateToolbarButtons: function(){
            if (this.accountRecord.get("accountId") > 0) {
                Ext.getCmp("admin_editAccountForm").action_delete.enable()
            }
        },
        display: function(B){
            var C = new Tine.widgets.dialog.EditRecord({
                id: "admin_editAccountForm",
                labelWidth: 120,
                labelAlign: "side",
                handlerScope: this,
                handlerApplyChanges: this.applyChanges,
                handlerSaveAndClose: this.saveChanges,
                handlerDelete: this.deleteAccount,
                items: this.editAccountDialog
            });
            var A = new Ext.Viewport({
                layout: "border",
                frame: true,
                items: C
            });
            this.updateAccountRecord(B);
            this.updateToolbarButtons();
            C.getForm().loadRecord(this.accountRecord)
        }
    }
}
();
Tine.Admin.Accounts.Account = Ext.data.Record.create([{
    name: "accountId"
}, {
    name: "accountFirstName"
}, {
    name: "accountLastName"
}, {
    name: "accountLoginName"
}, {
    name: "accountPassword"
}, {
    name: "accountDisplayName"
}, {
    name: "accountFullName"
}, {
    name: "accountStatus"
}, {
    name: "accountPrimaryGroup"
}, {
    name: "accountExpires",
    type: "date",
    dateFormat: "c"
}, {
    name: "accountLastLogin",
    type: "date",
    dateFormat: "c"
}, {
    name: "accountLastPasswordChange",
    type: "date",
    dateFormat: "c"
}, {
    name: "accountLastLoginfrom"
}, {
    name: "accountEmailAddress"
}]);
Ext.namespace("Tine.Admin.Groups");
Tine.Admin.Groups.Main = {
    actions: {
        addGroup: null,
        editGroup: null,
        deleteGroup: null
    },
    handlers: {
        addGroup: function(B, A){
            Tine.Tinebase.Common.openWindow("groupWindow", "index.php?method=Admin.editGroup&groupId=", 650, 600)
        },
        editGroup: function(D, A){
            var C = Ext.getCmp("AdminGroupsGrid").getSelectionModel().getSelections();
            var B = C[0].id;
            Tine.Tinebase.Common.openWindow("groupWindow", "index.php?method=Admin.editGroup&groupId=" + B, 650, 600)
        },
        deleteGroup: function(B, A){
            Ext.MessageBox.confirm("Confirm", "Do you really want to delete the selected groups?", function(F){
                if (F == "yes") {
                    var C = new Array();
                    var E = Ext.getCmp("AdminGroupsGrid").getSelectionModel().getSelections();
                    for (var D = 0; D < E.length; ++D) {
                        C.push(E[D].id)
                    }
                    C = Ext.util.JSON.encode(C);
                    Ext.Ajax.request({
                        url: "index.php",
                        params: {
                            method: "Admin.deleteGroups",
                            groupIds: C
                        },
                        text: "Deleting group(s)...",
                        success: function(H, G){
                            Ext.getCmp("AdminGroupsGrid").getStore().reload()
                        },
                        failure: function(G, H){
                            Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the group.")
                        }
                    })
                }
            })
        }
    },
    initComponent: function(){
        this.actions.addGroup = new Ext.Action({
            text: "add group",
            disabled: true,
            handler: this.handlers.addGroup,
            iconCls: "action_addGroup",
            scope: this
        });
        this.actions.editGroup = new Ext.Action({
            text: "edit group",
            disabled: true,
            handler: this.handlers.editGroup,
            iconCls: "action_edit",
            scope: this
        });
        this.actions.deleteGroup = new Ext.Action({
            text: "delete group",
            disabled: true,
            handler: this.handlers.deleteGroup,
            iconCls: "action_delete",
            scope: this
        })
    },
    displayGroupsToolbar: function(){
        var B = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 240,
            emptyText: "enter searchfilter"
        });
        B.on("change", function(){
            Ext.getCmp("AdminGroupsGrid").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        }, this);
        var A = new Ext.Toolbar({
            id: "AdminGroupsToolbar",
            split: false,
            height: 26,
            items: [this.actions.addGroup, this.actions.editGroup, this.actions.deleteGroup, "->", "Search:", " ", B]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(A)
    },
    displayGroupsGrid: function(){
        if (Tine.Tinebase.hasRight("manage", "accounts")) {
            this.actions.addGroup.setDisabled(false)
        }
        var A = new Ext.data.JsonStore({
            baseParams: {
                method: "Admin.getGroups"
            },
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Tine.Tinebase.Model.Group,
            remoteSort: true
        });
        A.setDefaultSort("id", "asc");
        A.on("beforeload", function(F){
            F.baseParams.filter = Ext.getCmp("quickSearchField").getRawValue()
        }, this);
        var E = new Ext.PagingToolbar({
            pageSize: 25,
            store: A,
            displayInfo: true,
            displayMsg: "Displaying groups {0} - {1} of {2}",
            emptyMsg: "No groups to display"
        });
        var D = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "id",
            header: "ID",
            dataIndex: "id",
            width: 10
        }, {
            resizable: true,
            id: "name",
            header: "Name",
            dataIndex: "name",
            width: 50
        }, {
            resizable: true,
            id: "description",
            header: "Description",
            dataIndex: "description"
        }]);
        D.defaultSortable = true;
        var C = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        C.on("selectionchange", function(G){
            var F = G.getCount();
            if (Tine.Tinebase.hasRight("manage", "accounts")) {
                if (F < 1) {
                    this.actions.deleteGroup.setDisabled(true);
                    this.actions.editGroup.setDisabled(true)
                }
                else {
                    if (F > 1) {
                        this.actions.deleteGroup.setDisabled(false);
                        this.actions.editGroup.setDisabled(true)
                    }
                    else {
                        this.actions.deleteGroup.setDisabled(false);
                        this.actions.editGroup.setDisabled(false)
                    }
                }
            }
        }, this);
        var B = new Ext.grid.GridPanel({
            id: "AdminGroupsGrid",
            store: A,
            cm: D,
            tbar: E,
            autoSizeColumns: false,
            selModel: C,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "n_family",
            border: false,
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                emptyText: "No groups to display"
            })
        });
        B.on("rowcontextmenu", function(G, F, I){
            I.stopEvent();
            if (!G.getSelectionModel().isSelected(F)) {
                G.getSelectionModel().selectRow(F)
            }
            var H = new Ext.menu.Menu({
                id: "ctxMenuGroups",
                items: [this.actions.editGroup, this.actions.deleteGroup, "-", this.actions.addGroup]
            });
            H.showAt(I.getXY())
        }, this);
        B.on("rowdblclick", function(G, H, I){
            if (Tine.Tinebase.hasRight("manage", "accounts")) {
                var F = G.getStore().getAt(H);
                try {
                    Tine.Tinebase.Common.openWindow("groupWindow", "index.php?method=Admin.editGroup&groupId=" + F.data.id, 650, 600)
                } 
                catch (J) {
                }
            }
        }, this);
        Tine.Tinebase.MainScreen.setActiveContentPanel(B)
    },
    loadData: function(){
        var A = Ext.getCmp("AdminGroupsGrid").getStore();
        A.load({
            params: {
                start: 0,
                limit: 50
            }
        })
    },
    show: function(){
        this.initComponent();
        var A = Tine.Tinebase.MainScreen.getActiveToolbar();
        if (A === false || A.id != "AdminGroupsToolbar") {
            this.displayGroupsToolbar();
            this.displayGroupsGrid()
        }
        this.loadData()
    },
    reload: function(){
        if (Ext.ComponentMgr.all.containsKey("AdminGroupsGrid")) {
            setTimeout("Ext.getCmp('AdminGroupsGrid').getStore().reload()", 200)
        }
    }
};
Tine.Admin.Groups.EditDialog = {
    handlers: {
        removeAccount: function(F, B){
            var A = Ext.getCmp("groupMembersGrid");
            var E = A.getSelectionModel().getSelections();
            var D = this.dataStore;
            for (var C = 0; C < E.length; ++C) {
                D.remove(E[C])
            }
        },
        addAccount: function(E){
            var B = Ext.getCmp("groupMembersGrid");
            var D = B.getStore();
            var A = B.getSelectionModel();
            if (D.getById(E.data.data.accountId) === undefined) {
                var C = new Tine.Tinebase.Model.User({
                    accountId: E.data.data.accountId,
                    accountDisplayName: E.data.data.accountDisplayName
                }, E.data.data.accountId);
                D.addSorted(C)
            }
            A.selectRow(D.indexOfId(E.data.data.accountId))
        },
        applyChanges: function(G, C, B){
            var F = Ext.getCmp("groupDialog").getForm();
            if (F.isValid()) {
                var A = Ext.getCmp("groupMembersGrid");
                Ext.MessageBox.wait("Please wait", "Updating Memberships");
                var D = [];
                var E = A.getStore();
                E.each(function(H){
                    D.push(H.data.accountId)
                });
                F.updateRecord(Tine.Admin.Groups.EditDialog.groupRecord);
                Ext.Ajax.request({
                    params: {
                        method: "Admin.saveGroup",
                        groupData: Ext.util.JSON.encode(Tine.Admin.Groups.EditDialog.groupRecord.data),
                        groupMembers: Ext.util.JSON.encode(D)
                    },
                    success: function(I, H){
                        if (window.opener.Tine.Admin.Groups) {
                            window.opener.Tine.Admin.Groups.Main.reload()
                        }
                        if (B === true) {
                            window.close()
                        }
                        else {
                            Ext.MessageBox.hide()
                        }
                    },
                    failure: function(H, I){
                        Ext.MessageBox.alert("Failed", "Could not save group.")
                    },
                    scope: this
                })
            }
            else {
                Ext.MessageBox.alert("Errors", "Please fix the errors noted.")
            }
        },
        saveAndClose: function(B, A){
            this.handlers.applyChanges(B, A, true)
        },
        deleteGroup: function(C, A){
            var B = Ext.util.JSON.encode([Tine.Admin.Groups.EditDialog.groupRecord.data.id]);
            Ext.Ajax.request({
                url: "index.php",
                params: {
                    method: "Admin.deleteGroups",
                    groupIds: B
                },
                text: "Deleting group...",
                success: function(E, D){
                    if (window.opener.Tine.Admin.Groups) {
                        window.opener.Tine.Admin.Groups.Main.reload()
                    }
                    window.close()
                },
                failure: function(D, E){
                    Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the group.")
                }
            })
        }
    },
    groupRecord: null,
    updateGroupRecord: function(A){
        if (A.length === 0) {
            A = {}
        }
        this.groupRecord = new Tine.Tinebase.Model.Group(A)
    },
    updateToolbarButtons: function(A){
        Ext.getCmp("groupDialog").action_delete.enable()
    },
    display: function(B, D){
        this.actions = {
            addAccount: new Ext.Action({
                text: "add account",
                disabled: true,
                scope: this,
                handler: this.handlers.addAccount,
                iconCls: "action_addContact"
            }),
            removeAccount: new Ext.Action({
                text: "remove account",
                disabled: true,
                scope: this,
                handler: this.handlers.removeAccount,
                iconCls: "action_deleteContact"
            })
        };
        var I = new Tine.widgets.account.PickerPanel({
            enableBbar: true,
            region: "west",
            height: 200,
            selectAction: function(){
                this.account = account;
                this.handlers.addAccount(account)
            }
        });
        I.on("accountdblclick", function(K){
            this.account = K;
            this.handlers.addAccount(K)
        }, this);
        this.dataStore = new Ext.data.JsonStore({
            root: "results",
            totalProperty: "totalcount",
            id: "accountId",
            fields: Tine.Tinebase.Model.User
        });
        Ext.StoreMgr.add("GroupMembersStore", this.dataStore);
        this.dataStore.setDefaultSort("accountDisplayName", "asc");
        if (D.length === 0) {
            this.dataStore.removeAll()
        }
        else {
            this.dataStore.loadData(D)
        }
        var C = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "accountDisplayName",
            header: "Name",
            dataIndex: "accountDisplayName",
            width: 30
        }]);
        var J = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        J.on("selectionchange", function(L){
            var K = L.getCount();
            if (K < 1) {
                this.actions.removeAccount.setDisabled(true)
            }
            else {
                this.actions.removeAccount.setDisabled(false)
            }
        }, this);
        var G = new Ext.Toolbar({
            items: [this.actions.removeAccount]
        });
        var H = new Ext.grid.EditorGridPanel({
            id: "groupMembersGrid",
            region: "center",
            title: "Group Members",
            store: this.dataStore,
            cm: C,
            autoSizeColumns: false,
            selModel: J,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "accountDisplayName",
            bbar: G,
            border: true
        });
        var A = {
            layout: "border",
            border: false,
            width: 600,
            height: 500,
            items: [{
                region: "north",
                layout: "column",
                border: false,
                autoHeight: true,
                items: [{
                    columnWidth: 1,
                    layout: "form",
                    border: false,
                    items: [{
                        xtype: "textfield",
                        fieldLabel: "Group Name",
                        name: "name",
                        anchor: "100%",
                        allowBlank: false
                    }, {
                        xtype: "textarea",
                        name: "description",
                        fieldLabel: "Description",
                        grow: false,
                        preventScrollbars: false,
                        anchor: "100%",
                        height: 60
                    }]
                }]
            }, I, H]
        };
        var F = new Tine.widgets.dialog.EditRecord({
            id: "groupDialog",
            title: "Edit Group " + B.name,
            layout: "fit",
            labelWidth: 120,
            labelAlign: "top",
            handlerScope: this,
            handlerApplyChanges: this.handlers.applyChanges,
            handlerSaveAndClose: this.handlers.saveAndClose,
            handlerDelete: this.handlers.deleteGroup,
            handlerExport: this.handlers.exportGroup,
            items: A
        });
        var E = new Ext.Viewport({
            layout: "border",
            frame: true,
            items: F
        });
        this.updateGroupRecord(B);
        this.updateToolbarButtons(B.grants);
        F.getForm().loadRecord(this.groupRecord)
    }
};
Ext.namespace("Tine.Admin.Tags");
Tine.Admin.Tags.Main = {
    actions: {
        addTag: null,
        editTag: null,
        deleteTag: null
    },
    handlers: {
        addTag: function(B, A){
            Tine.Tinebase.Common.openWindow("tagWindow", "index.php?method=Admin.editTag&tagId=", 650, 400)
        },
        editTag: function(D, A){
            var C = Ext.getCmp("AdminTagsGrid").getSelectionModel().getSelections();
            var B = C[0].id;
            Tine.Tinebase.Common.openWindow("tagWindow", "index.php?method=Admin.editTag&tagId=" + B, 650, 400)
        },
        deleteTag: function(B, A){
            Ext.MessageBox.confirm("Confirm", "Do you really want to delete the selected tags?", function(F){
                if (F == "yes") {
                    var D = new Array();
                    var E = Ext.getCmp("AdminTagsGrid").getSelectionModel().getSelections();
                    for (var C = 0; C < E.length; ++C) {
                        D.push(E[C].id)
                    }
                    D = Ext.util.JSON.encode(D);
                    Ext.Ajax.request({
                        url: "index.php",
                        params: {
                            method: "Admin.deleteTags",
                            tagIds: D
                        },
                        text: "Deleting tag(s)...",
                        success: function(H, G){
                            Ext.getCmp("AdminTagsGrid").getStore().reload()
                        }
                    })
                }
            })
        }
    },
    initComponent: function(){
        this.actions.addTag = new Ext.Action({
            text: "add tag",
            handler: this.handlers.addTag,
            iconCls: "action_tag",
            scope: this
        });
        this.actions.editTag = new Ext.Action({
            text: "edit tag",
            disabled: true,
            handler: this.handlers.editTag,
            iconCls: "action_edit",
            scope: this
        });
        this.actions.deleteTag = new Ext.Action({
            text: "delete tag",
            disabled: true,
            handler: this.handlers.deleteTag,
            iconCls: "action_delete",
            scope: this
        })
    },
    displayTagsToolbar: function(){
        var B = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 240,
            emptyText: "enter searchfilter"
        });
        B.on("change", function(){
            Ext.getCmp("AdminTagsGrid").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        }, this);
        var A = new Ext.Toolbar({
            id: "AdminTagsToolbar",
            split: false,
            height: 26,
            items: [this.actions.addTag, this.actions.editTag, this.actions.deleteTag, "->", "Search:", " ", B]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(A)
    },
    displayTagsGrid: function(){
        var A = new Ext.data.JsonStore({
            baseParams: {
                method: "Admin.getTags"
            },
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Tine.Tinebase.Model.Tag,
            remoteSort: true
        });
        A.setDefaultSort("name", "asc");
        A.on("beforeload", function(F){
            F.baseParams.query = Ext.getCmp("quickSearchField").getRawValue()
        }, this);
        var E = new Ext.PagingToolbar({
            pageSize: 25,
            store: A,
            displayInfo: true,
            displayMsg: "Displaying tags {0} - {1} of {2}",
            emptyMsg: "No tags to display"
        });
        var D = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "color",
            header: "color",
            dataIndex: "color",
            width: 25,
            renderer: function(F){
                return '<div style="width: 8px; height: 8px; background-color:' + F + '; border: 1px solid black;">&#160;</dev>'
            }
        }, {
            resizable: true,
            id: "name",
            header: "Name",
            dataIndex: "name",
            width: 200
        }, {
            resizable: true,
            id: "description",
            header: "Description",
            dataIndex: "description",
            width: 500
        }]);
        D.defaultSortable = true;
        var C = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        C.on("selectionchange", function(G){
            var F = G.getCount();
            if (F < 1) {
                this.actions.deleteTag.setDisabled(true);
                this.actions.editTag.setDisabled(true)
            }
            else {
                if (F > 1) {
                    this.actions.deleteTag.setDisabled(false);
                    this.actions.editTag.setDisabled(true)
                }
                else {
                    this.actions.deleteTag.setDisabled(false);
                    this.actions.editTag.setDisabled(false)
                }
            }
        }, this);
        var B = new Ext.grid.GridPanel({
            id: "AdminTagsGrid",
            store: A,
            cm: D,
            tbar: E,
            autoSizeColumns: false,
            selModel: C,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "description",
            border: false,
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                emptyText: "No tags to display"
            })
        });
        B.on("rowcontextmenu", function(G, F, I){
            I.stopEvent();
            if (!G.getSelectionModel().isSelected(F)) {
                G.getSelectionModel().selectRow(F)
            }
            var H = new Ext.menu.Menu({
                id: "ctxMenuTags",
                items: [this.actions.editTag, this.actions.deleteTag, "-", this.actions.addTag]
            });
            H.showAt(I.getXY())
        }, this);
        B.on("rowdblclick", function(G, H, I){
            var F = G.getStore().getAt(H);
            try {
                Tine.Tinebase.Common.openWindow("tagWindow", "index.php?method=Admin.editTag&tagId=" + F.data.id, 650, 400)
            } 
            catch (J) {
            }
        }, this);
        Tine.Tinebase.MainScreen.setActiveContentPanel(B)
    },
    loadData: function(){
        var A = Ext.getCmp("AdminTagsGrid").getStore();
        A.load({
            params: {
                start: 0,
                limit: 50
            }
        })
    },
    show: function(){
        this.initComponent();
        var A = Tine.Tinebase.MainScreen.getActiveToolbar();
        if (A === false || A.id != "AdminTagsToolbar") {
            this.displayTagsToolbar();
            this.displayTagsGrid()
        }
        this.loadData()
    },
    reload: function(){
        if (Ext.ComponentMgr.all.containsKey("AdminTagsGrid")) {
            setTimeout("Ext.getCmp('AdminTagsGrid').getStore().reload()", 200)
        }
    }
};
Tine.Admin.Tags.EditDialog = {
    handlers: {
        applyChanges: function(G, C, B){
            var D = Ext.getCmp("tagDialog").getForm();
            if (D.isValid()) {
                Ext.MessageBox.wait("Please wait", "Updating Memberships");
                var A = Tine.Admin.Tags.EditDialog.tagRecord;
                A.data.rights = [];
                var F = Ext.StoreMgr.lookup("adminSharedTagsRights");
                F.each(function(I){
                    A.data.rights.push(I.data)
                });
                A.data.contexts = [];
                var E = true;
                var H = Ext.getCmp("adminSharedTagsConfinePanel");
                H.getRootNode().eachChild(function(I){
                    if (I.attributes.checked) {
                        A.data.contexts.push(I.id)
                    }
                    else {
                        E = false
                    }
                });
                if (E) {
                    A.data.contexts = ["any"]
                }
                D.updateRecord(A);
                Ext.Ajax.request({
                    params: {
                        method: "Admin.saveTag",
                        tagData: Ext.util.JSON.encode(A.data)
                    },
                    success: function(J, I){
                        if (window.opener.Tine.Admin.Tags) {
                            window.opener.Tine.Admin.Tags.Main.reload()
                        }
                        if (B === true) {
                            window.close()
                        }
                        else {
                            this.updateTagRecord(Ext.util.JSON.decode(J.responseText).updatedData);
                            D.loadRecord(this.tagRecord);
                            Ext.MessageBox.hide()
                        }
                    },
                    failure: function(I, J){
                        Ext.MessageBox.alert("Failed", "Could not save tag.")
                    },
                    scope: this
                })
            }
            else {
                Ext.MessageBox.alert("Errors", "Please fix the errors noted.")
            }
        },
        saveAndClose: function(B, A){
            this.handlers.applyChanges(B, A, true)
        },
        deleteTag: function(C, A){
            var B = Ext.util.JSON.encode([Tine.Admin.Tags.EditDialog.tagRecord.data.id]);
            Ext.Ajax.request({
                url: "index.php",
                params: {
                    method: "Admin.deleteTags",
                    tagIds: B
                },
                text: "Deleting tag...",
                success: function(E, D){
                    if (window.opener.Tine.Admin.Tags) {
                        window.opener.Tine.Admin.Tags.Main.reload()
                    }
                    window.close()
                }
            })
        }
    },
    tagRecord: null,
    updateTagRecord: function(A){
        if (A.length === 0) {
            A = {}
        }
        this.tagRecord = new Tine.Tinebase.Model.Tag(A)
    },
    updateToolbarButtons: function(A){
    },
    display: function(J, C){
        var G = !J.contexts || J.contexts.indexOf("any") > -1;
        var D = new Ext.tree.TreeNode({
            text: "Allowed Contexts",
            expanded: true,
            draggable: false,
            allowDrop: false
        });
        var L = new Ext.tree.TreePanel({
            id: "adminSharedTagsConfinePanel",
            rootVisible: true,
            border: false,
            root: D
        });
        for (var I = 0, H = C.length; I < H; I++) {
            var E = C[I];
            if (E.name == "Tinebase") {
                continue
            }
            D.appendChild(new Ext.tree.TreeNode({
                text: E.name,
                id: E.id,
                checked: G || J.contexts.indexOf(E.id) > -1,
                leaf: true,
                icon: "s.gif"
            }))
        }
        if (!J.rights) {
            J.rights = [{
                tag_id: "",
                account_name: "Anyone",
                account_id: 0,
                account_type: "anyone",
                view_right: true,
                use_right: true
            }]
        }
        var B = new Ext.data.JsonStore({
            storeId: "adminSharedTagsRights",
            baseParams: {
                method: "Admin.getTagRights",
                containerId: J.id
            },
            root: "results",
            totalProperty: "totalcount",
            fields: ["account_name", "account_id", "account_type", "view_right", "use_right"]
        });
        B.loadData({
            results: J.rights,
            totalcount: J.rights.length
        });
        var F = new Tine.widgets.account.ConfigGrid({
            accountPickerType: "both",
            accountListTitle: "Account Rights",
            configStore: B,
            hasAccountPrefix: true,
            configColumns: [new Ext.ux.grid.CheckColumn({
                header: "View",
                dataIndex: "view_right",
                width: 55
            }), new Ext.ux.grid.CheckColumn({
                header: "Use",
                dataIndex: "use_right",
                width: 55
            })]
        });
        var A = {
            layout: "hfit",
            border: false,
            width: 600,
            height: 350,
            items: [{
                xtype: "columnform",
                border: false,
                autoHeight: true,
                items: [[{
                    columnWidth: 0.3,
                    fieldLabel: "Tag Name",
                    name: "name",
                    allowBlank: false
                }, {
                    columnWidth: 0.5,
                    name: "description",
                    fieldLabel: "Description",
                    anchor: "100%"
                }]]
            }, {
                xtype: "tabpanel",
                height: 300,
                activeTab: 0,
                deferredRender: false,
                defaults: {
                    autoScroll: true
                },
                border: true,
                plain: true,
                items: [{
                    title: "Rights",
                    items: [F]
                }, {
                    title: "Context",
                    items: [L]
                }]
            }]
        };
        var M = new Tine.widgets.dialog.EditRecord({
            id: "tagDialog",
            layout: "hfit",
            labelWidth: 120,
            labelAlign: "top",
            handlerScope: this,
            handlerApplyChanges: this.handlers.applyChanges,
            handlerSaveAndClose: this.handlers.saveAndClose,
            handlerDelete: this.handlers.deleteTag,
            handlerExport: this.handlers.exportTag,
            items: A
        });
        var K = new Ext.Viewport({
            layout: "border",
            frame: true,
            items: M
        });
        this.updateTagRecord(J);
        M.getForm().loadRecord(this.tagRecord)
    }
};
Ext.namespace("Tine.Admin.Roles");
Tine.Admin.Roles.Main = {
    actions: {
        addRole: null,
        editRole: null,
        deleteRole: null
    },
    handlers: {
        addRole: function(B, A){
            Tine.Tinebase.Common.openWindow("roleWindow", "index.php?method=Admin.editRole&roleId=", 650, 600)
        },
        editRole: function(D, A){
            var C = Ext.getCmp("AdminRolesGrid").getSelectionModel().getSelections();
            var B = C[0].id;
            Tine.Tinebase.Common.openWindow("roleWindow", "index.php?method=Admin.editRole&roleId=" + B, 650, 600)
        },
        deleteRole: function(B, A){
            Ext.MessageBox.confirm("Confirm", "Do you really want to delete the selected roles?", function(E){
                if (E == "yes") {
                    var F = new Array();
                    var D = Ext.getCmp("AdminRolesGrid").getSelectionModel().getSelections();
                    for (var C = 0; C < D.length; ++C) {
                        F.push(D[C].id)
                    }
                    F = Ext.util.JSON.encode(F);
                    Ext.Ajax.request({
                        url: "index.php",
                        params: {
                            method: "Admin.deleteRoles",
                            roleIds: F
                        },
                        text: "Deleting role(s)...",
                        success: function(H, G){
                            Ext.getCmp("AdminRolesGrid").getStore().reload()
                        },
                        failure: function(G, H){
                            Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the role.")
                        }
                    })
                }
            })
        }
    },
    initComponent: function(){
        this.actions.addRole = new Ext.Action({
            text: "add role",
            disabled: true,
            handler: this.handlers.addRole,
            iconCls: "action_permissions",
            scope: this
        });
        this.actions.editRole = new Ext.Action({
            text: "edit role",
            disabled: true,
            handler: this.handlers.editRole,
            iconCls: "action_edit",
            scope: this
        });
        this.actions.deleteRole = new Ext.Action({
            text: "delete role",
            disabled: true,
            handler: this.handlers.deleteRole,
            iconCls: "action_delete",
            scope: this
        })
    },
    displayRolesToolbar: function(){
        var B = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 240,
            emptyText: "enter searchfilter"
        });
        B.on("change", function(){
            Ext.getCmp("AdminRolesGrid").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        }, this);
        var A = new Ext.Toolbar({
            id: "AdminRolesToolbar",
            split: false,
            height: 26,
            items: [this.actions.addRole, this.actions.editRole, this.actions.deleteRole, "->", "Search:", " ", B]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(A)
    },
    displayRolesGrid: function(){
        if (Tine.Tinebase.hasRight("manage", "roles")) {
            this.actions.addRole.setDisabled(false)
        }
        var A = new Ext.data.JsonStore({
            baseParams: {
                method: "Admin.getRoles"
            },
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Tine.Tinebase.Model.Role,
            remoteSort: true
        });
        A.setDefaultSort("id", "asc");
        A.on("beforeload", function(F){
            F.baseParams.query = Ext.getCmp("quickSearchField").getRawValue()
        }, this);
        var E = new Ext.PagingToolbar({
            pageSize: 25,
            store: A,
            displayInfo: true,
            displayMsg: "Displaying roles {0} - {1} of {2}",
            emptyMsg: "No roles to display"
        });
        var D = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "id",
            header: "ID",
            dataIndex: "id",
            width: 10
        }, {
            resizable: true,
            id: "name",
            header: "Name",
            dataIndex: "name",
            width: 50
        }, {
            resizable: true,
            id: "description",
            header: "Description",
            dataIndex: "description"
        }]);
        D.defaultSortable = true;
        var C = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        C.on("selectionchange", function(G){
            var F = G.getCount();
            if (Tine.Tinebase.hasRight("manage", "roles")) {
                if (F < 1) {
                    this.actions.deleteRole.setDisabled(true);
                    this.actions.editRole.setDisabled(true)
                }
                else {
                    if (F > 1) {
                        this.actions.deleteRole.setDisabled(false);
                        this.actions.editRole.setDisabled(true)
                    }
                    else {
                        this.actions.deleteRole.setDisabled(false);
                        this.actions.editRole.setDisabled(false)
                    }
                }
            }
        }, this);
        var B = new Ext.grid.GridPanel({
            id: "AdminRolesGrid",
            store: A,
            cm: D,
            tbar: E,
            autoSizeColumns: false,
            selModel: C,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "n_family",
            border: false,
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                emptyText: "No roles to display"
            })
        });
        B.on("rowcontextmenu", function(G, F, I){
            I.stopEvent();
            if (!G.getSelectionModel().isSelected(F)) {
                G.getSelectionModel().selectRow(F)
            }
            var H = new Ext.menu.Menu({
                id: "ctxMenuRoles",
                items: [this.actions.editRole, this.actions.deleteRole, "-", this.actions.addRole]
            });
            H.showAt(I.getXY())
        }, this);
        B.on("rowdblclick", function(G, H, I){
            if (Tine.Tinebase.hasRight("manage", "roles")) {
                var F = G.getStore().getAt(H);
                try {
                    Tine.Tinebase.Common.openWindow("roleWindow", "index.php?method=Admin.editRole&roleId=" + F.data.id, 650, 600)
                } 
                catch (J) {
                }
            }
        }, this);
        Tine.Tinebase.MainScreen.setActiveContentPanel(B)
    },
    loadData: function(){
        var A = Ext.getCmp("AdminRolesGrid").getStore();
        A.load({
            params: {
                start: 0,
                limit: 50
            }
        })
    },
    show: function(){
        this.initComponent();
        var A = Tine.Tinebase.MainScreen.getActiveToolbar();
        if (A === false || A.id != "AdminRolesToolbar") {
            this.displayRolesToolbar();
            this.displayRolesGrid()
        }
        this.loadData()
    },
    reload: function(){
        if (Ext.ComponentMgr.all.containsKey("AdminRolesGrid")) {
            setTimeout("Ext.getCmp('AdminRolesGrid').getStore().reload()", 200)
        }
    }
};
Tine.Admin.Roles.EditDialog = {
    getRecordIndex: function(B, A){
        var C = false;
        A.each(function(D){
            if ((D.data.type == "user" || D.data.type == "account") && B.data.type == "user" && D.data.id == B.data.id) {
                C = D.id
            }
            else {
                if (D.data.account_type == "group" && B.data.type == "group" && D.data.id == B.data.id) {
                    C = D.id
                }
            }
        });
        return C ? A.indexOfId(C) : false
    },
    getRightId: function(D, B){
        var C = false;
        var A = 0;
        this.rightsDataStore.each(function(E){
            if (E.data.application_id == D && E.data.right == B) {
                A = E.id;
                return
            }
        });
        return A
    },
    handlers: {
        removeAccount: function(F, B){
            var A = Ext.getCmp("roleMembersGrid");
            var E = A.getSelectionModel().getSelections();
            var C = this.membersDataStore;
            for (var D = 0; D < E.length; ++D) {
                C.remove(E[D])
            }
        },
        addAccount: function(F){
            var C = Ext.getCmp("roleMembersGrid");
            var E = C.getStore();
            var A = C.getSelectionModel();
            var D = Tine.Admin.Roles.EditDialog.getRecordIndex(F, E);
            if (D === false) {
                var B = new Ext.data.Record({
                    id: F.data.id,
                    type: F.data.type,
                    name: F.data.name
                }, F.data.id);
                E.addSorted(B)
            }
            A.selectRow(E.indexOfId(F.data.id))
        },
        applyChanges: function(I, C, F){
            var B = Ext.getCmp("roleDialog").getForm();
            if (B.isValid()) {
                var E = Ext.getCmp("roleMembersGrid");
                Ext.MessageBox.wait("Please wait", "Updating Memberships");
                var D = [];
                var H = Ext.StoreMgr.lookup("RoleMembersStore");
                H.each(function(J){
                    D.push(J.data)
                });
                var G = [];
                var A = Ext.StoreMgr.get("RoleRightsStore");
                A.each(function(J){
                    G.push(J.data)
                });
                B.updateRecord(Tine.Admin.Roles.EditDialog.roleRecord);
                Ext.Ajax.request({
                    params: {
                        method: "Admin.saveRole",
                        roleData: Ext.util.JSON.encode(Tine.Admin.Roles.EditDialog.roleRecord.data),
                        roleMembers: Ext.util.JSON.encode(D),
                        roleRights: Ext.util.JSON.encode(G)
                    },
                    success: function(L, K){
                        if (window.opener.Tine.Admin.Roles) {
                            window.opener.Tine.Admin.Roles.Main.reload()
                        }
                        if (F === true) {
                            window.close()
                        }
                        else {
                            var J = Ext.util.JSON.decode(L.responseText);
                            this.updateRoleRecord(J.updatedData);
                            B.loadRecord(this.roleRecord);
                            Ext.MessageBox.hide()
                        }
                    },
                    failure: function(J, K){
                        Ext.MessageBox.alert("Failed", "Could not save role.")
                    },
                    scope: this
                })
            }
            else {
                Ext.MessageBox.alert("Errors", "Please fix the errors noted.")
            }
        },
        saveAndClose: function(B, A){
            this.handlers.applyChanges(B, A, true)
        },
        deleteRole: function(B, A){
            var C = Ext.util.JSON.encode([Tine.Admin.Roles.EditDialog.roleRecord.data.id]);
            Ext.Ajax.request({
                url: "index.php",
                params: {
                    method: "Admin.deleteRoles",
                    roleIds: C
                },
                text: "Deleting role...",
                success: function(E, D){
                    if (window.opener.Tine.Admin.Roles) {
                        window.opener.Tine.Admin.Roles.Main.reload()
                    }
                    window.close()
                },
                failure: function(D, E){
                    Ext.MessageBox.alert("Failed", "Some error occured while trying to delete the role.")
                }
            })
        }
    },
    roleRecord: null,
    rightsDataStore: null,
    updateRoleRecord: function(A){
        if (A.length === 0) {
            A = {}
        }
        this.roleRecord = new Tine.Tinebase.Model.Role(A)
    },
    getRightsTree: function(I){
        var G = new Ext.tree.TreePanel({
            id: "rightsTree",
            iconCls: "AdminTreePanel",
            rootVisible: false,
            border: false
        });
        var D = new Ext.tree.TreeNode({
            text: "root",
            draggable: false,
            allowDrop: false,
            id: "root"
        });
        G.setRootNode(D);
        for (var H = 0; H < I.length; H++) {
            var C = new Ext.tree.TreeNode(I[H]);
            C.attributes.application_id = I[H].application_id;
            C.expanded = true;
            D.appendChild(C);
            if (I[H].children) {
                for (var F = 0; F < I[H].children.length; F++) {
                    var B = I[H].children[F];
                    B.leaf = true;
                    B.icon = "s.gif";
                    var E = (this.getRightId(I[H].application_id, B.right) > 0);
                    B.checked = E;
                    var A = new Ext.tree.TreeNode(B);
                    A.attributes.right = B.right;
                    A.on("checkchange", function(K, J){
                        var M = K.parentNode.attributes.application_id;
                        if (J) {
                            this.rightsDataStore.add(new Ext.data.Record({
                                right: K.attributes.right,
                                application_id: M
                            }))
                        }
                        else {
                            var L = this.getRightId(M, K.attributes.right);
                            this.rightsDataStore.remove(this.rightsDataStore.getById(L))
                        }
                    }, this);
                    C.appendChild(A)
                }
            }
        }
        return G
    },
    display: function(J, C, K, I){
        this.membersDataStore = new Ext.data.JsonStore({
            root: "results",
            totalProperty: "totalcount",
            fields: ["account_name", "account_id", "account_type"]
        });
        Ext.StoreMgr.add("RoleMembersStore", this.membersDataStore);
        if (C.length === 0) {
            this.membersDataStore.removeAll()
        }
        else {
            this.membersDataStore.loadData(C)
        }
        var A = new Tine.widgets.account.ConfigGrid({
            accountPickerType: "both",
            accountPickerTypeDefault: "group",
            accountListTitle: "Role members",
            configStore: this.membersDataStore,
            hasAccountPrefix: true,
            configColumns: []
        });
        this.rightsDataStore = new Ext.data.JsonStore({
            root: "results",
            totalProperty: "totalcount",
            fields: Tine.Admin.Roles.Right
        });
        Ext.StoreMgr.add("RoleRightsStore", this.rightsDataStore);
        if (K.length === 0) {
            this.rightsDataStore.removeAll()
        }
        else {
            this.rightsDataStore.loadData(K)
        }
        var B = this.getRightsTree(I);
        var H = {
            title: "Members",
            layout: "form",
            layoutOnTabChange: true,
            deferredRender: false,
            border: false,
            items: [A]
        };
        var G = {
            title: "Rights",
            layout: "form",
            layoutOnTabChange: true,
            deferredRender: false,
            autoScroll: true,
            anchor: "100% 100%",
            border: false,
            items: [B]
        };
        var F = {
            layout: "border",
            border: false,
            width: 600,
            height: 500,
            items: [{
                region: "north",
                layout: "column",
                border: false,
                autoHeight: true,
                items: [{
                    columnWidth: 1,
                    layout: "form",
                    border: false,
                    items: [{
                        xtype: "textfield",
                        fieldLabel: "Role Name",
                        name: "name",
                        anchor: "100%",
                        allowBlank: false
                    }, {
                        xtype: "textarea",
                        name: "description",
                        fieldLabel: "Description",
                        grow: false,
                        preventScrollbars: false,
                        anchor: "100%",
                        height: 60
                    }]
                }]
            }, new Ext.TabPanel({
                plain: true,
                region: "center",
                activeTab: 0,
                id: "editMainTabPanel",
                layoutOnTabChange: true,
                items: [H, G]
            })]
        };
        var E = new Tine.widgets.dialog.EditRecord({
            id: "roleDialog",
            layout: "fit",
            labelWidth: 120,
            labelAlign: "top",
            handlerScope: this,
            handlerApplyChanges: this.handlers.applyChanges,
            handlerSaveAndClose: this.handlers.saveAndClose,
            handlerDelete: this.handlers.deleteRole,
            handlerExport: this.handlers.exportRole,
            items: F
        });
        var D = new Ext.Viewport({
            layout: "border",
            frame: true,
            items: E
        });
        this.updateRoleRecord(J);
        E.getForm().loadRecord(this.roleRecord)
    }
};
Tine.Admin.Roles.Right = Ext.data.Record.create([{
    name: "application_id"
}, {
    name: "right"
}, ]);
Ext.namespace("Tine.Dialer");
Tine.Dialer.getPanel = function(){
    var A = new Ext.tree.TreePanel({
        id: "dialerTree",
        iconCls: "DialerIconCls",
        title: "Dialer",
        border: false,
        root: new Ext.tree.TreeNode({
            text: "root",
            draggable: false,
            allowDrop: false,
            id: "root"
        })
    });
    A.on("click", function(B){
        Tine.Dialer.Main.show(B)
    }, this);
    A.on("beforeexpand", function(B){
        if (B.getSelectionModel().getSelectedNode() === null) {
            B.expandPath("/root/all");
            B.selectPath("/root/all")
        }
        B.fireEvent("click", B.getSelectionModel().getSelectedNode())
    }, this);
    return A
};
Tine.Dialer.Main = {
    actions: {
        dialNumber: null
    },
    initComponent: function(){
        this.actions.dialNumber = new Ext.Action({
            text: "Dial number",
            tooltip: "Initiate a new outgoing call",
            handler: this.handlers.dialNumber,
            iconCls: "action_DialNumber",
            scope: this
        })
    },
    handlers: {
        dialNumber: function(B, A){
            Ext.MessageBox.prompt("Number", "Please enter number to dial:", function(C, D){
                if (C == "ok") {
                    Ext.Ajax.request({
                        url: "index.php",
                        params: {
                            method: "Dialer.dialNumber",
                            number: D
                        },
                        success: function(F, E){
                        },
                        failure: function(E, F){
                        }
                    })
                }
            })
        }
    },
    displayToolbar: function(){
        var B = new Ext.ux.SearchField({
            id: "quickSearchField",
            width: 240,
            emptyText: "enter searchfilter"
        });
        B.on("change", function(){
            Ext.getCmp("Dialer_Grid").getStore().load({
                params: {
                    start: 0,
                    limit: 50
                }
            })
        }, this);
        var A = new Ext.Toolbar({
            id: "Dialer_Toolbar",
            split: false,
            height: 26,
            items: [this.actions.dialNumber, "->", "Search:", " ", B]
        });
        Tine.Tinebase.MainScreen.setActiveToolbar(A)
    },
    displayGrid: function(){
        var A = new Ext.data.JsonStore({
            root: "results",
            totalProperty: "totalcount",
            id: "id",
            fields: Tine.Addressbook.Model.Contact,
            remoteSort: true
        });
        A.setDefaultSort("n_family", "asc");
        A.on("beforeload", function(F){
            F.baseParams.filter = Ext.getCmp("quickSearchField").getRawValue()
        }, this);
        var E = new Ext.PagingToolbar({
            pageSize: 25,
            store: A,
            displayInfo: true,
            displayMsg: "Displaying contacts {0} - {1} of {2}",
            emptyMsg: "No contacts to display"
        });
        var D = new Ext.grid.ColumnModel([{
            resizable: true,
            id: "n_family",
            header: "Family name",
            dataIndex: "n_family"
        }, {
            resizable: true,
            id: "n_given",
            header: "Given name",
            dataIndex: "n_given",
            width: 80
        }, {
            resizable: true,
            id: "n_fn",
            header: "Full name",
            dataIndex: "n_fn",
            hidden: true
        }, {
            resizable: true,
            id: "n_fileas",
            header: "Name + Firm",
            dataIndex: "n_fileas",
            hidden: true
        }]);
        D.defaultSortable = true;
        var C = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
        C.on("selectionchange", function(I){
            var G = I.getCount();
            if (G < 1) {
                this.actions.deleteContact.setDisabled(true);
                this.actions.editContact.setDisabled(true);
                this.actions.exportContact.setDisabled(true);
                this.actions.callContact.setDisabled(true)
            }
            else {
                if (G > 1) {
                    this.actions.deleteContact.setDisabled(false);
                    this.actions.editContact.setDisabled(true);
                    this.actions.exportContact.setDisabled(true);
                    this.actions.callContact.setDisabled(true)
                }
                else {
                    this.actions.deleteContact.setDisabled(false);
                    this.actions.editContact.setDisabled(false);
                    this.actions.exportContact.setDisabled(false);
                    var H = Ext.menu.MenuMgr.get("Addressbook_Contacts_CallContact_Menu");
                    H.removeAll();
                    var F = I.getSelected();
                    if (!Ext.isEmpty(F.data.tel_work)) {
                        H.add({
                            id: "Addressbook_Contacts_CallContact_Work",
                            text: "work " + F.data.tel_work + "",
                            handler: this.handlers.callContact
                        });
                        this.actions.callContact.setDisabled(false)
                    }
                    if (!Ext.isEmpty(F.data.tel_home)) {
                        H.add({
                            id: "Addressbook_Contacts_CallContact_Home",
                            text: "home " + F.data.tel_home + "",
                            handler: this.handlers.callContact
                        });
                        this.actions.callContact.setDisabled(false)
                    }
                    if (!Ext.isEmpty(F.data.tel_cell)) {
                        H.add({
                            id: "Addressbook_Contacts_CallContact_Cell",
                            text: "cell " + F.data.tel_cell + "",
                            handler: this.handlers.callContact
                        });
                        this.actions.callContact.setDisabled(false)
                    }
                    if (!Ext.isEmpty(F.data.tel_cell_private)) {
                        H.add({
                            id: "Addressbook_Contacts_CallContact_CellPrivate",
                            text: "cell private " + F.data.tel_cell_private + "",
                            handler: this.handlers.callContact
                        });
                        this.actions.callContact.setDisabled(false)
                    }
                }
            }
        }, this);
        var B = new Ext.grid.GridPanel({
            id: "Addressbook_Contacts_Grid",
            store: A,
            cm: D,
            tbar: E,
            autoSizeColumns: false,
            selModel: C,
            enableColLock: false,
            loadMask: true,
            autoExpandColumn: "n_family",
            border: false,
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                emptyText: "No contacts to display"
            })
        });
        B.on("rowcontextmenu", function(G, F, I){
            I.stopEvent();
            if (!G.getSelectionModel().isSelected(F)) {
                G.getSelectionModel().selectRow(F)
            }
            var H = new Ext.menu.Menu({
                id: "ctxMenuContacts",
                items: [this.actions.editContact, this.actions.deleteContact, this.actions.exportContact, "-", this.actions.addContact]
            });
            H.showAt(I.getXY())
        }, this);
        B.on("rowdblclick", function(G, H, I){
            var F = G.getStore().getAt(H);
            try {
                Tine.Tinebase.Common.openWindow("contactWindow", "index.php?method=Addressbook.editContact&_contactId=" + F.data.id, 800, 600)
            } 
            catch (J) {
            }
        }, this);
        Tine.Tinebase.MainScreen.setActiveContentPanel(B)
    },
    updateMainToolbar: function(){
        var C = Ext.menu.MenuMgr.get("Tinebase_System_AdminMenu");
        C.removeAll();
        var B = Ext.getCmp("tineMenu").items.get("Tinebase_System_AdminButton");
        B.setIconClass("DialerTreePanel");
        B.setDisabled(true);
        var A = Ext.getCmp("tineMenu").items.get("Tinebase_System_PreferencesButton");
        A.setIconClass("DialerTreePanel");
        A.setDisabled(true)
    },
    show: function(B){
        this.initComponent();
        var A = Tine.Tinebase.MainScreen.getActiveToolbar();
        if (A === false || A.id != "Dialer_Toolbar") {
            this.displayToolbar();
            this.displayGrid();
            this.updateMainToolbar()
        }
    }
};
