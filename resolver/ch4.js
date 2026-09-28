var DOTALL = 32;
var CASE_INSENSITIVE = 2;
var StreamCherryDecoder = {
  decode: function (html) {
    Log.d("Start decoding in JS now...");
    var links = [];
    try {
      var encodedBlocks = getMatches(
        html,
        /<p[^>]+id="[^"]+">([^<]{40,})<\/p>/gi,
        1,
      );
      var unusedKey = eval(getMatches(html, /_0x59ce16=([^;]+)/g, 1)[0]);
      var xorKeyA = eval(getMatches(html, /_1x4bfb36=([^;]+)/g, 1)[0]);
      var xorKeyB = eval(
        getMatches(html, /_0x30725e,(\(parseInt.*?)\),/g, 1)[0],
      );
      for (var i = 0; i < encodedBlocks.length; i++) {
        try {
          var block = encodedBlocks[i];
          var streamId = "";
          var keyWords = [];
          for (var k = 0; k < block.substring(0, 9 * 8).length; k += 8) {
            keyWords.push(parseInt(block.substring(k, k + 8), 16));
          }
          var pos = 0;
          var wordIndex = 0;
          while (pos < block.substring(9 * 8, block.length).length) {
            var terminator = 64;
            var value = 0;
            var bitShift = 0;
            var byte = 0;
            while (true) {
              if (pos + 1 >= block.substring(9 * 8, block.length).length) {
                terminator = 143;
              }
              byte = parseInt(
                block.substring(9 * 8 + pos, 9 * 8 + pos + 2),
                16,
              );
              pos += 2;
              if (bitShift < 6 * 5) {
                var bits6 = byte & 63;
                value += bits6 << bitShift;
              } else {
                var bits6 = byte & 63;
                value += parseInt(bits6 * Math.pow(2, bitShift));
              }
              bitShift += 6;
              if (byte < terminator) {
                break;
              }
            }
            var decodedWord =
              value ^ keyWords[wordIndex % 9] ^ xorKeyB ^ xorKeyA;
            var mask = terminator * 2 + 127;
            mask = terminator * 2 + 127;
            for (var k = 0; k < 4; k++) {
              var ch = String.fromCharCode(
                ((decodedWord & mask) >> (((9 * 8) / 9) * k)) - 1,
              );
              if (ch != "$") {
                streamId += ch;
              }
              mask = mask << (72 / 9);
            }
            wordIndex += 1;
          }
          if (streamId.length >= 8) {
            links.push("https://openload.co/stream/" + streamId + "?mime=true");
          }
        } catch (cD) {
          Log.d("Error occurred while decoding\n" + cD.message);
        }
      }
    } catch (cK) {
      Log.d(
        "Error occurred while trying to get link using eval()\n" + cK.message,
      );
    }
    return JSON.stringify(links);
  },
  isEnabled: function () {
    return true;
  },
};
function charIsNumeric(cL) {
  return !isNaN(parseInt(cL, 10));
}
function unpackHtml(html) {
  Log.d("unpacking html");
  var tokenMap = ["j", "_", "__", "___"];
  var strRegex = '\\{\\s*var\\s+a\\s*=\\s*"([^"]+)';
  var packedStrings = getJavaRegexMatches(html, strRegex, 1, CASE_INSENSITIVE);
  Log.d("stringsLen = " + packedStrings.length);
  if (packedStrings.length <= 0) {
    return html;
  }
  var shiftRegex = "\\)\\);\\}\\((\\d+)\\)";
  var shifts = getJavaRegexMatches(html, shiftRegex, 1, -1);
  var pairs = zip(packedStrings, shifts);
  for (var i = 0, n = pairs.length; i < n; ++i) {
    var pair = pairs[i];
    var str = pair[0];
    var shift = pair[1];
    Log.d("str = " + str);
    Log.d("shift = " + shift);
    var decoded = caesarShift(str, parseInt(shift));
    decoded = JavaUrlDecoder.decode(decoded);
    j = 0;
    len2 = tokenMap.length;
    for (; j < len2; ++j) {
      decoded = decoded.replace(j.toString(), tokenMap[j]);
    }
    html += "<script>" + decoded + "</script>";
    Log.d("res = " + decoded);
  }
  return html;
}
function caesarShift(str, shift) {
  if (!shift) {
    shift = 13;
  } else {
    shift = parseInt(shift);
  }
  var out = "";
  var eM = "Z";
  var upperZ = eM.charCodeAt(0);
  var chars = getCharsFromString(str);
  for (var i = 0, n = chars.length; i < n; ++i) {
    var c = chars[i];
    var code = c.charCodeAt(0);
    if (isAlpha(c)) {
      var limit;
      if (code <= upperZ) {
        limit = 90;
      } else {
        limit = 122;
      }
      var shifted = code + shift;
      if (shifted > limit) {
        shifted = shifted - 26;
      }
      out += String.fromCharCode(shifted);
    } else {
      out += c;
    }
  }
  Log.d("s2 = " + out);
  return out;
}
function getAllMagicNumbers(eN) {
  return [3];
}
function getMatches(str, regex, group) {
  group ||= 1;
  var results = [];
  var m;
  while ((m = regex.exec(str))) {
    results.push(m[group]);
  }
  return results;
}
function isAlpha(eZ) {
  return /^[a-zA-Z()]+$/.test(eZ);
}
function zip(f0, f1) {
  return f0.map(function (f2, f3) {
    return [f2, f1[f3]];
  });
}
function getCharsFromString(fb) {
  return fb.split(
    /(?=(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/,
  );
}
function sortObject(fc) {
  return Object.keys(fc)
    .sort()
    .reduce(function (fd, fe) {
      fd[fe] = fc[fe];
      return fd;
    }, {});
}
function getJavaRegexMatches(fj, fk, fl, fm) {
  if (fm && fm > -1) {
    return JSON.parse(JavaRegex.findAllWithMode(fj, fk, fl, fm));
  } else {
    return JSON.parse(JavaRegex.findAll(fj, fk, fl));
  }
}
function newUnescape(fr) {
  if (fr == null) {
    return "";
  }
  var fF = new RegExp("(" + Object.keys(chars).join("|") + ")", "g");
  return String(fr).replace(fF, function (fG) {
    return chars[fG];
  });
}
var chars = {
  "&#39;": "'",
  "&amp;": "&",
  "&gt;": ">",
  "&lt;": "<",
  "&quot;": '"',
};
function aadecode(code) {
  var evalPrefix = "(ﾟДﾟ) ['_'] ( (ﾟДﾟ) ['_'] (";
  var returnPrefix = "( (ﾟДﾟ) ['_'] (";
  var evalSuffix = ") (ﾟΘﾟ)) ('_');";
  var returnSuffix = ") ());";
  code = code.replace(/^\s*/, "").replace(/\s*$/, "");
  if (/^\s*$/.test(code)) {
    return "";
  }
  if (code.lastIndexOf(evalPrefix) < 0) {
    throw new Error("Given code is not encoded as aaencode.");
  }
  if (code.lastIndexOf(evalSuffix) != code.length - evalSuffix.length) {
    throw new Error("Given code is not encoded as aaencode.");
  }
  var rewritten = code
    .replace(evalPrefix, returnPrefix)
    .replace(evalSuffix, returnSuffix);
  return eval(rewritten);
}
function jjdecode(code) {
  var out = "";
  code = code.replace(/^\s+|\s+$/g, "");
  var start;
  var end;
  var gv;
  var gvLen;
  if (code.indexOf('"\'\\"+\'+",') == 0) {
    start = code.indexOf('$$+"\\""+') + 8;
    end = code.indexOf('"\\"")())()');
    gv = code.substring(code.indexOf('"\'\\"+\'+",') + 9, code.indexOf("=~[]"));
    gvLen = gv.length;
  } else {
    gv = code.substr(0, code.indexOf("="));
    gvLen = gv.length;
    start = code.indexOf('"\\""+') + 5;
    end = code.indexOf('"\\"")())()');
  }
  if (start == end) {
    throw new Error("No data !");
  }
  var data = code.substring(start, end);
  var b16Tokens = [
    "___+",
    "__$+",
    "_$_+",
    "_$$+",
    "$__+",
    "$_$+",
    "$$_+",
    "$$$+",
    "$___+",
    "$__$+",
    "$_$_+",
    "$_$$+",
    "$$__+",
    "$$_$+",
    "$$$_+",
    "$$$$+",
  ];
  var k0 = '(![]+"")[' + gv + "._$_]+";
  var ky = gv + "._$+";
  var kx = gv + ".__+";
  var ks = gv + "._+";
  var jZ = gv + ".";
  var kD = '"';
  var kA = gv + ".";
  var kT = '\\\\\\"';
  var kS = "\\\\\\\\";
  var k3 = '\\\\"+';
  var kB = '\\\\"+' + gv + "._+";
  var kU = '"+';
  while (data != "") {
    if (0 == data.indexOf(k0)) {
      data = data.substr(k0.length);
      out = out + "l";
      continue;
    } else if (0 == data.indexOf(ky)) {
      data = data.substr(ky.length);
      out = out + "o";
      continue;
    } else if (0 == data.indexOf(kx)) {
      data = data.substr(kx.length);
      out = out + "t";
      continue;
    } else if (0 == data.indexOf(ks)) {
      data = data.substr(ks.length);
      out = out + "u";
      continue;
    }
    if (0 == data.indexOf(jZ)) {
      data = data.substr(jZ.length);
      var k4 = 0;
      for (k4 = 0; k4 < b16Tokens.length; k4++) {
        if (0 == data.indexOf(b16Tokens[k4])) {
          data = data.substr(b16Tokens[k4].length);
          out = out + k4.toString(16);
          break;
        }
      }
      continue;
    }
    if (0 == data.indexOf(kD)) {
      data = data.substr(kD.length);
      if (0 == data.indexOf(kB)) {
        data = data.substr(kB.length);
        var k5 = "";
        for (kN = 0; kN < 2; kN++) {
          if (0 == data.indexOf(kA)) {
            data = data.substr(kA.length);
            for (kP = 0; kP < b16Tokens.length; kP++) {
              if (0 == data.indexOf(b16Tokens[kP])) {
                data = data.substr(b16Tokens[kP].length);
                k5 += kP.toString(16) + "";
                break;
              }
            }
          } else {
            break;
          }
        }
        out = out + String.fromCharCode(parseInt(k5, 16));
        continue;
      } else if (0 == data.indexOf(k3)) {
        data = data.substr(k3.length);
        var k5 = "";
        var ka = "";
        var kb = "";
        var kc = 0;
        for (kN = 0; kN < 3; kN++) {
          if (kN > 1) {
            if (0 == data.indexOf(k0)) {
              data = data.substr(k0.length);
              ka = "l";
              break;
            } else if (0 == data.indexOf(ky)) {
              data = data.substr(ky.length);
              ka = "o";
              break;
            } else if (0 == data.indexOf(kx)) {
              data = data.substr(kx.length);
              ka = "t";
              break;
            } else if (0 == data.indexOf(ks)) {
              data = data.substr(ks.length);
              ka = "u";
              break;
            }
          }
          if (0 == data.indexOf(kA)) {
            kb = data.substr(kA.length);
            for (kP = 0; kP < 8; kP++) {
              if (0 == kb.indexOf(b16Tokens[kP])) {
                if (parseInt(k5 + kP + "", 8) > 128) {
                  kc = 1;
                  break;
                }
                k5 += kP + "";
                data = data.substr(kA.length);
                data = data.substr(b16Tokens[kP].length);
                break;
              }
            }
            if (1 == kc) {
              if (0 == data.indexOf(jZ)) {
                data = data.substr(jZ.length);
                var k4 = 0;
                for (k4 = 0; k4 < b16Tokens.length; k4++) {
                  if (0 == data.indexOf(b16Tokens[k4])) {
                    data = data.substr(b16Tokens[k4].length);
                    ka = k4.toString(16);
                    break;
                  }
                }
                break;
              }
            }
          } else {
            break;
          }
        }
        out = out + (String.fromCharCode(parseInt(k5, 8)) + ka);
        continue;
      } else {
        var ke = 0;
        var kf;
        while (true) {
          kf = data.charCodeAt(0);
          if (0 == data.indexOf(kT)) {
            data = data.substr(kT.length);
            out = out + '"';
            ke += 1;
            continue;
          } else if (0 == data.indexOf(kS)) {
            data = data.substr(kS.length);
            out = out + "\\";
            ke += 1;
            continue;
          } else if (0 == data.indexOf(kU)) {
            if (ke == 0) {
              throw new Error("+ no match S block: " + data);
            }
            data = data.substr(kU.length);
            break;
          } else if (data.indexOf(kB) == 0) {
            if (ke == 0) {
              throw new Error("no match S block n>128: " + data);
            }
            data = data.substr(kB.length);
            var k5 = "";
            var ka = "";
            for (kN = 0; kN < 10; kN++) {
              if (kN > 1) {
                if (0 == data.indexOf(k0)) {
                  data = data.substr(k0.length);
                  ka = "l";
                  break;
                } else if (data.indexOf(ky) == 0) {
                  data = data.substr(ky.length);
                  ka = "o";
                  break;
                } else if (0 == data.indexOf(kx)) {
                  data = data.substr(kx.length);
                  ka = "t";
                  break;
                } else if (0 == data.indexOf(ks)) {
                  data = data.substr(ks.length);
                  ka = "u";
                  break;
                }
              }
              if (0 == data.indexOf(kA)) {
                data = data.substr(kA.length);
                for (kP = 0; kP < b16Tokens.length; kP++) {
                  if (0 == data.indexOf(b16Tokens[kP])) {
                    data = data.substr(b16Tokens[kP].length);
                    k5 += kP.toString(16) + "";
                    break;
                  }
                }
              } else {
                break;
              }
            }
            out = out + String.fromCharCode(parseInt(k5, 16));
            break;
          } else if (0 == data.indexOf(k3)) {
            if (ke == 0) {
              throw new Error("no match S block n<128: " + data);
            }
            data = data.substr(k3.length);
            var k5 = "";
            var ka = "";
            var kb = "";
            var kc = 0;
            for (kN = 0; kN < 3; kN++) {
              if (kN > 1) {
                if (0 == data.indexOf(k0)) {
                  data = data.substr(k0.length);
                  ka = "l";
                  break;
                } else if (0 == data.indexOf(ky)) {
                  data = data.substr(ky.length);
                  ka = "o";
                  break;
                } else if (0 == data.indexOf(kx)) {
                  data = data.substr(kx.length);
                  ka = "t";
                  break;
                } else if (0 == data.indexOf(ks)) {
                  data = data.substr(ks.length);
                  ka = "u";
                  break;
                }
              }
              if (0 == data.indexOf(kA)) {
                kb = data.substr(kA.length);
                for (kP = 0; kP < 8; kP++) {
                  if (0 == kb.indexOf(b16Tokens[kP])) {
                    if (parseInt(k5 + kP + "", 8) > 128) {
                      kc = 1;
                      break;
                    }
                    k5 += kP + "";
                    data = data.substr(kA.length);
                    data = data.substr(b16Tokens[kP].length);
                    break;
                  }
                }
                if (1 == kc) {
                  if (0 == data.indexOf(jZ)) {
                    data = data.substr(jZ.length);
                    var k4 = 0;
                    for (k4 = 0; k4 < b16Tokens.length; k4++) {
                      if (0 == data.indexOf(b16Tokens[k4])) {
                        data = data.substr(b16Tokens[k4].length);
                        ka = k4.toString(16);
                        break;
                      }
                    }
                  }
                }
              } else {
                break;
              }
            }
            out = out + (String.fromCharCode(parseInt(k5, 8)) + ka);
            break;
          } else if (
            (33 <= kf && kf <= 47) ||
            (58 <= kf && kf <= 64) ||
            (91 <= kf && kf <= 96) ||
            (123 <= kf && kf <= 127)
          ) {
            out = out + data.charAt(0);
            data = data.substr(1);
            ke += 1;
          }
        }
        continue;
      }
    }
    throw new Error("no match : " + data);
    break;
  }
  return out;
}
