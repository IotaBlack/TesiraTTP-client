export type token =
  | tokenHeader
  | tokenString
  | tokenNumber
  | tokenPunctuation
  | tokenOpeningBracket
  | tokenCloseBracket
  | tokenWhitespace
  | tokenLiteral;

type tokenHeader = {
  type: "header";
  value: "+OK" | "-ERR" | "!";
};
type tokenString = {
  type: "string";
  value: string;
};
type tokenNumber = {
  type: "number";
  value: string;
};
type tokenPunctuation = {
  type: "punctuation";
  value: ":" | ";" | ",";
};
type bracketType = "parens" | "square" | "curly";
type tokenOpeningBracket = {
  type: "openBracket";
  bracketType: bracketType;
  value: "(" | "[" | "{";
};
type tokenCloseBracket = {
  type: "closeBracket";
  bracketType: bracketType;
  value: ")" | "]" | "}";
};
type tokenWhitespace = {
  type: "whitespace";
  value: " ";
};

type tokenLiteral = { type: "literal"; value: string };

const bracketTypeMap = {
  "(": "parens",
  "[": "square",
  "{": "curly",
  ")": "parens",
  "]": "square",
  "}": "curly",
};

export type anyTTPMessage =
  | TTP_OK_MESSAGE
  | TTP_ERR_MESSAGE
  | TTP_SUBSCRIPTION_MESSAGE
  | LITERAL_MESSAGE
  | UNKNOWN_MESSAGE;

export interface TTPMessage<T extends "OK" | "ERR" | "SUBSCRIPTION" | "string" | "unknown"> {
  type: T
  message: string;
}
export interface TTP_OK_MESSAGE<T = object> extends TTPMessage<"OK"> {
  content:T;
}
export interface TTP_ERR_MESSAGE extends TTPMessage<"ERR"> {
  content: string;
}
export interface TTP_SUBSCRIPTION_MESSAGE<T = any> extends TTPMessage<"SUBSCRIPTION"> {
  publishToken: string;
  value: T;
}

export interface LITERAL_MESSAGE extends TTPMessage<"string"> {
  type: "string";
  content: string;
}
export interface UNKNOWN_MESSAGE extends TTPMessage<"unknown"> {
  content: unknown;
}
export function parseMessage(message: string): anyTTPMessage {
  let tMessage = tokenizeMessage(message);
  let header = tMessage.shift();
  switch (header.type) {
    case "header":
      switch (header.value) {
        case "+OK":
          return {
            type: "OK",
            content: parsekeyvaluepairs(tMessage),
            message: message,
          } as TTP_OK_MESSAGE;
        case "-ERR":
          return { type: "ERR", content: message, message: message } as TTP_ERR_MESSAGE;
        case "!":
          let content = parsekeyvaluepairs(tMessage);
          return {
            type: "SUBSCRIPTION",
            publishToken: content["publishToken"],
            value: content["value"],
            message: message,
          } as TTP_SUBSCRIPTION_MESSAGE;
      }
      break;
    case "string":
    case "literal": //this is redundant
    case "number": //this is redundant
      return { type: "string", content: header.value, message: message };
    default:
      //WAT
      return { type: "unknown", content: tMessage, message: message };
  }
}

const closeBracketSymbol = Symbol("closeBracket");

type value = number | Boolean | string | object | value[] | typeof closeBracketSymbol

function parsevalue(tArray: token[]):value{
  cleanWhitespace(tArray);
  if (tArray.length === 0) return closeBracketSymbol;
  let token = tArray.shift();
  switch (token.type) {
    case "number":
      return parseFloat(token.value);
    case "literal":
      switch (token.value) {
        case "true":
          return true;
        case "false":
          return false;
        case "null":
          return null;
        default:
          return token.value;
          throw new SyntaxError("Unexpected " + token.value);
      }
    case "string":
      return token.value;
    case "openBracket":
      cleanWhitespace(tArray);
      if (token.bracketType == "square") {
        let result = [];
        let value = parsevalue(tArray);
        while (value !== closeBracketSymbol) {
          result.push(value);
          value = parsevalue(tArray);
        }
        let token = tArray.shift();
        if (token.type == "closeBracket" && token.bracketType == "square") {

          return result;
        } else {
          throw new SyntaxError("Unexpected " + token.value);
        }
      }
      if (token.bracketType == "curly") {
        let obj = parsekeyvaluepairs(tArray);
        let token = tArray.shift();
        if (token.type == "closeBracket" && token.bracketType == "curly") {
          return obj;
        } else {
          throw new SyntaxError("Unexpected " + token.value);
        }
      }
    //wat
    case "closeBracket":
      tArray.unshift(token);
      return closeBracketSymbol;
    default:
      throw new SyntaxError("Unexpected " + token.value);
  }
}

function parsekeyvaluepairs(tArray: token[]) {
  let result = {};
  let key = parsevalue(tArray);
  let value;
  while (
    tArray.length &&
    key !== closeBracketSymbol &&
    typeof key == "string"
  ) {
    cleanWhitespace(tArray);
    let token = tArray.shift();
    if (token.type == "punctuation" && token.value == ":") {
      cleanWhitespace(tArray);
      if (tArray[0].type == "closeBracket" || tArray[0].type == "punctuation") {
        throw new SyntaxError("Unexpected " + tArray[0].value);
      }
      value = parsevalue(tArray);
    } else {
      throw new SyntaxError("Unexpected " + tArray[0].value);
    }
    result[key] = value;
    key = parsevalue(tArray);
  }
  return result;
}
function cleanWhitespace(arr: token[]) {
  while (arr.length && arr[0].type == "whitespace") arr.shift();
}

export function tokenizeMessage(message: string): token[] {
  let result: token[] = [];
  if (message.startsWith("+OK")) {
    let token: tokenHeader = { type: "header", value: "+OK" };
    result.push(token);
    message = message.slice(3);
  } else if (message.startsWith("-ERR")) {
    let token: tokenHeader = { type: "header", value: "-ERR" };
    result.push(token);
    message = message.slice(4);
  } else if (message.startsWith("!")) {
    let token: tokenHeader = { type: "header", value: "!" };
    result.push(token);
    message = message.slice(1);
  } else {
    result.push({ type: "string", value: message });
    return result;
  }

  for (let i = 0; i < message.length; i++) {
    switch (message[i]) {
      case " ":
        result.push({ type: "whitespace", value: " " });
        continue;
      case '"':
        let token: tokenString = { type: "string", value: "" };
        while (message[++i] != '"') {
          if (message[i] == "\\") ++i;
          token.value += message[i];
        }
        result.push(token);
        continue;

      case "[":
      case "{":
        result.push({
          type: "openBracket",
          value: message[i] as "(" | "[" | "{",
          bracketType: bracketTypeMap[message[i]],
        });
        continue;
      case "]":
      case "}":
        result.push({
          type: "closeBracket",
          value: message[i] as ")" | "]" | "}",
          bracketType: bracketTypeMap[message[i]],
        });
        continue;

      case ":":
        result.push({
          type: "punctuation",
          value: ":",
        });
        continue;
      default:
        if (message[i].match(/[\d\-]/)) {
          let value = message.substr(i).match(/^-?\d+(\.\d+)?/)[0];
          i += value.length
          let token: tokenNumber = {
            type: "number",
            value: value,
          };
          result.push(token);
          continue;
        }

        if (result[result.length - 1].type == "literal") {
          result[result.length - 1].value += message[i];
        } else result.push({ type: "literal", value: message[i] });
      // console.error(new SyntaxError(`Couldn't parse "${message}"`));
      // return result;
    }
  }

  return result;
}
