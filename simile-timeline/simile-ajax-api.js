/*==================================================
 *  Simile Ajax API - Minimal Implementation for Timeline
 *  
 *  This is a minimal implementation of the Simile Ajax API
 *  specifically designed to support Timeline functionality.
 *==================================================*/

window.SimileAjax = {
    DateTime: {
        MILLISECOND: 0,
        SECOND:      1,
        MINUTE:      2,
        HOUR:        3,
        DAY:         4,
        WEEK:        5,
        MONTH:       6,
        YEAR:        7,
        DECADE:      8,
        CENTURY:     9,
        MILLENNIUM:  10,
        
        gregorianUnitLengths: [
            1,                 // millisecond
            1000,              // second
            60 * 1000,         // minute
            60 * 60 * 1000,    // hour
            24 * 60 * 60 * 1000, // day
            7 * 24 * 60 * 60 * 1000, // week
            30 * 24 * 60 * 60 * 1000, // month (approximate)
            365 * 24 * 60 * 60 * 1000, // year (approximate)
            10 * 365 * 24 * 60 * 60 * 1000, // decade (approximate)
            100 * 365 * 24 * 60 * 60 * 1000, // century (approximate)
            1000 * 365 * 24 * 60 * 60 * 1000 // millennium (approximate)
        ],
        
        parseGregorianDateTime: function(o) {
            if (o == null) {
                return null;
            } else if (o instanceof Date) {
                return o;
            } else if (typeof o == "number") {
                return new Date(o);
            } else {
                var s = o.toString();
                if (s.length > 0 && s.length < 8) {
                    var space = s.indexOf(" ");
                    if (space > 0) {
                        var year = parseInt(s.substr(0, space));
                        var suffix = s.substr(space + 1);
                        if (suffix.toLowerCase() == "bc") {
                            year = 1 - year;
                        }
                    } else {
                        var year = parseInt(s);
                    }
                    
                    var d = new Date(0);
                    d.setUTCFullYear(year);
                    return d;
                }
                
                try {
                    return new Date(Date.parse(s));
                } catch (e) {
                    return null;
                }
            }
        },
        
        roundDownToInterval: function(date, intervalUnit, timeZone, multiple, theme) {
            var timeShift = timeZone * 
                SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
                
            var date2 = new Date(date.getTime() + timeShift);
            var clearInDay = function(d) {
                d.setUTCMilliseconds(0);
                d.setUTCSeconds(0);
                d.setUTCMinutes(0);
                d.setUTCHours(0);
            };
            var clearInYear = function(d) {
                clearInDay(d);
                d.setUTCDate(1);
                d.setUTCMonth(0);
            };
            
            switch(intervalUnit) {
                case SimileAjax.DateTime.MILLISECOND:
                    var x = date2.getUTCMilliseconds();
                    date2.setUTCMilliseconds(x - (x % multiple));
                    break;
                case SimileAjax.DateTime.SECOND:
                    date2.setUTCMilliseconds(0);
                    
                    var x = date2.getUTCSeconds();
                    date2.setUTCSeconds(x - (x % multiple));
                    break;
                case SimileAjax.DateTime.MINUTE:
                    date2.setUTCMilliseconds(0);
                    date2.setUTCSeconds(0);
                    
                    var x = date2.getUTCMinutes();
                    date2.setTime(date2.getTime() - 
                        (x % multiple) * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
                    break;
                case SimileAjax.DateTime.HOUR:
                    date2.setUTCMilliseconds(0);
                    date2.setUTCSeconds(0);
                    date2.setUTCMinutes(0);
                    
                    var x = date2.getUTCHours();
                    date2.setUTCHours(x - (x % multiple));
                    break;
                case SimileAjax.DateTime.DAY:
                    clearInDay(date2);
                    break;
                case SimileAjax.DateTime.WEEK:
                    clearInDay(date2);
                    var d = (date2.getUTCDay() + 7 - SimileAjax.DateTime.firstDayOfWeek) % 7;
                    date2.setTime(date2.getTime() - 
                        d * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.DAY]);
                    break;
                case SimileAjax.DateTime.MONTH:
                    clearInDay(date2);
                    date2.setUTCDate(1);
                    
                    var x = date2.getUTCMonth();
                    date2.setUTCMonth(x - (x % multiple));
                    break;
                case SimileAjax.DateTime.YEAR:
                    clearInYear(date2);
                    
                    var x = date2.getUTCFullYear();
                    date2.setUTCFullYear(x - (x % multiple));
                    break;
                case SimileAjax.DateTime.DECADE:
                    clearInYear(date2);
                    date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 10) * 10);
                    break;
                case SimileAjax.DateTime.CENTURY:
                    clearInYear(date2);
                    date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 100) * 100);
                    break;
                case SimileAjax.DateTime.MILLENNIUM:
                    clearInYear(date2);
                    date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 1000) * 1000);
                    break;
            }
            
            date.setTime(date2.getTime() - timeShift);
            return date;
        },
        
        incrementByInterval: function(date, intervalUnit, timeZone) {
            var timeShift = timeZone * 
                SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
                
            var date2 = new Date(date.getTime() + timeShift);
            
            switch(intervalUnit) {
                case SimileAjax.DateTime.MILLISECOND:
                    date2.setTime(date2.getTime() + 1)
                    break;
                case SimileAjax.DateTime.SECOND:
                    date2.setTime(date2.getTime() + 1000);
                    break;
                case SimileAjax.DateTime.MINUTE:
                    date2.setTime(date2.getTime() + SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
                    break;
                case SimileAjax.DateTime.HOUR:
                    date2.setTime(date2.getTime() + SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
                    break;
                case SimileAjax.DateTime.DAY:
                    date2.setUTCDate(date2.getUTCDate() + 1);
                    break;
                case SimileAjax.DateTime.WEEK:
                    date2.setUTCDate(date2.getUTCDate() + 7);
                    break;
                case SimileAjax.DateTime.MONTH:
                    date2.setUTCMonth(date2.getUTCMonth() + 1);
                    break;
                case SimileAjax.DateTime.YEAR:
                    date2.setUTCFullYear(date2.getUTCFullYear() + 1);
                    break;
                case SimileAjax.DateTime.DECADE:
                    date2.setUTCFullYear(date2.getUTCFullYear() + 10);
                    break;
                case SimileAjax.DateTime.CENTURY:
                    date2.setUTCFullYear(date2.getUTCFullYear() + 100);
                    break;
                case SimileAjax.DateTime.MILLENNIUM:
                    date2.setUTCFullYear(date2.getUTCFullYear() + 1000);
                    break;
            }
            
            date.setTime(date2.getTime() - timeShift);
            return date;
        },
        
        firstDayOfWeek: 0 // Sunday
    },
    
    History: {
        enabled: true,
        addListener: function(listener) {},
        addAction: function(action) {}
    },
    
    WindowManager: {
        getHighestIndex: function() { return 1000; },
        registerForDragging: function() {}
    },
    
    Graphics: {
        getWidthHeight: function(element) {
            return {
                width: element.offsetWidth || 100,
                height: element.offsetHeight || 100
            };
        },
        
        getFontRenderingContext: function(element, fontFamily, fontSize, fontWeight) {
            return {
                computeSize: function(text) {
                    // Simple estimation
                    return {
                        width: text.length * (fontSize || 12) * 0.6,
                        height: (fontSize || 12) * 1.2
                    };
                }
            };
        }
    },
    
    DOM: {
        getEventTarget: function(event) {
            return event.target || event.srcElement;
        },
        
        registerEvent: function(element, eventType, handler) {
            if (element.addEventListener) {
                element.addEventListener(eventType, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + eventType, handler);
            }
        },
        
        getPageCoordinates: function(element) {
            var left = 0;
            var top = 0;
            while (element) {
                left += element.offsetLeft;
                top += element.offsetTop;
                element = element.offsetParent;
            }
            return { left: left, top: top };
        }
    },
    
    XMLHttpRequest: {
        get: function(url, fError, fDone) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        fDone(xhr);
                    } else {
                        if (fError) fError(xhr.statusText, xhr.status, xhr);
                    }
                }
            };
            xhr.send(null);
            return xhr;
        }
    },
    
    includeJavascriptFile: function(doc, url, fDone, fError) {
        var script = doc.createElement("script");
        script.type = "text/javascript";
        script.language = "JavaScript";
        
        if (fDone != null) {
            script.onload = function() { fDone(); };
            script.onerror = function() { if (fError) fError(); };
        }
        
        script.src = url;
        doc.getElementsByTagName("head")[0].appendChild(script);
    },
    
    includeCssFile: function(doc, url) {
        var link = doc.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);
        doc.getElementsByTagName("head")[0].appendChild(link);
    },
    
    // EventIndex implementation for Timeline
    EventIndex: function(unit) {
        this._unit = unit || SimileAjax.NativeDateUnit;
        this._events = [];
        this._index = {};
    }
};

// Add EventIndex prototype methods
SimileAjax.EventIndex.prototype = {
    getUnit: function() {
        return this._unit;
    },
    
    add: function(evt) {
        this._events.push(evt);
        this._index[evt.getID()] = evt;
    },
    
    removeAll: function() {
        this._events = [];
        this._index = {};
    },
    
    getCount: function() {
        return this._events.length;
    },
    
    getIterator: function(startDate, endDate) {
        return new SimileAjax.EventIndex._Iterator(this._events, startDate, endDate, this._unit);
    },
    
    getAllIterator: function() {
        return new SimileAjax.EventIndex._Iterator(this._events, null, null, this._unit);
    },
    
    getEarliestDate: function() {
        var evt = this._events[0];
        return evt == null ? null : evt.getStart();
    },
    
    getLatestDate: function() {
        var evt = this._events[this._events.length - 1];
        return evt == null ? null : evt.getEnd();
    }
};

// Iterator for EventIndex
SimileAjax.EventIndex._Iterator = function(events, startDate, endDate, unit) {
    this._events = events;
    this._startDate = startDate;
    this._endDate = endDate;
    this._unit = unit;
    this._index = 0;
};

SimileAjax.EventIndex._Iterator.prototype = {
    hasNext: function() {
        return this._index < this._events.length;
    },
    
    next: function() {
        return this._index < this._events.length ? this._events[this._index++] : null;
    },
    
    reset: function() {
        this._index = 0;
    }
};

// Add NativeDateUnit
SimileAjax.NativeDateUnit = {
    getParser: function(format) {
        return SimileAjax.DateTime.parseGregorianDateTime;
    }
};

// Add includeJavascriptFiles and includeCssFiles (plural) methods
SimileAjax.includeJavascriptFiles = function(doc, urlPrefix, filenames) {
    for (var i = 0; i < filenames.length; i++) {
        SimileAjax.includeJavascriptFile(doc, urlPrefix + filenames[i]);
    }
};

SimileAjax.includeCssFiles = function(doc, urlPrefix, filenames) {
    for (var i = 0; i < filenames.length; i++) {
        SimileAjax.includeCssFile(doc, urlPrefix + filenames[i]);
    }
};

// Initialize
if (typeof window.Timeline === 'undefined') {
    window.Timeline = {};
}

console.log("Simile Ajax API (enhanced) loaded successfully");