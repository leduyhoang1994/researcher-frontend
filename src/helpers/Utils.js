// import { object } from "yup";
import { defaultDirection } from "../constants/defaultValues";

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key], B = b[key];
    if (order.indexOf(A + "") > order.indexOf(B + "")) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
};


export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '.' + mm + '.' + yyyy;
}

export const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes()
}

export const getDirection = () => {
  let direction = defaultDirection;
  if (localStorage.getItem("direction")) {
    const localValue = localStorage.getItem("direction");
    if (localValue === "rtl" || localValue === "ltr") {
      direction = localValue;
    }
  }
  return {
    direction,
    isRtl: direction === "rtl"
  };
};

export const setDirection = localValue => {
  let direction = "ltr";
  if (localValue === "rtl" || localValue === "ltr") {
    direction = localValue;
  }
  localStorage.setItem("direction", direction);
};


export const arrayColumn = (array, columnName) => {
  return array.map(function (value, index) {
    return value[columnName];
  })
}

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const numberFormat = (number, p, ts, dp) => {
  var t = [];
  if (typeof p == 'undefined') p = 2;
  if (typeof ts == 'undefined') ts = ',';
  if (typeof dp == 'undefined') dp = '.';

  number = Number(number).toFixed(p).split('.');

  for (var iLen = number[0].length, i = iLen ? iLen % 3 || 3 : 0, j = 0; i <= iLen; i += 3) {
    t.push(number[0].substring(j, i));
    j = i;
  }
  return t.join(ts) + (number[1] ? dp + number[1] : '');
}

export const currencyFormatNDT = (number) => {
  return new Intl.NumberFormat('zh-CN').format(number);
}

export const currencyFormatVND = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
}


function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

export const jsonToFormData = (data, formData) => {
  if (!formData) formData = new FormData();

  buildFormData(formData, data);

  return formData;
}

export function copySamplePropertiesObj(sourceObj, targetObj) {
  Object.keys(targetObj).forEach(key => {
    targetObj[key] = sourceObj[key];
  })

  return targetObj
}

export const parse = (file) => {
  // Always return a Promise
  return new Promise((resolve, reject) => {
    let content = '';
    const reader = new FileReader();
    // Wait till complete
    reader.onloadend = function (e) {
      content = e.target.result;
      resolve(content);
    };
    // Make sure to handle error states
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
}

export const removeVietnameseTones = (string) => {
  string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  string = string.replace(/đ/g, "d");
  string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  string = string.replace(/Đ/g, "D");
  string = string.replace(/ /g, "")
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  string = string.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  string = string.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  string = string.replace(/ + /g, " ");
  string = string.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  string = string.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");
  return string;
}

export const getRangeSelection = (element) => {
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      return win.getSelection().getRangeAt(0);
    }
  } else if ((sel = doc.selection) && sel.type !== "Control") {
    return doc.body.createTextRange();
  }
}

export const insertToEditor = (container, insertElement, indexElement) => {
  if (!indexElement) {
    container.append(insertElement);
  } else {
    console.log(container);
    console.log(indexElement);
    container.insertBefore(insertElement, indexElement.nextSibling);
  }
}

export const getIndexTagOnKeyDown = (element) => {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type !== "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

// node_walk: walk the element tree, stop when func(node) returns false
const node_walk = (node, func) => {
  var result = func(node);
  for(node = node.firstChild; result !== false && node; node = node.nextSibling)
    result = node_walk(node, func);
  return result;
};

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)
export const getIndexTagOnKeyDown1 = (elem) => {
  var sel = window.getSelection();
  var cum_length = [0, 0];

  if(sel.anchorNode == elem)
    cum_length = [sel.anchorOffset, sel.extentOffset];
  else {
    var nodes_to_find = [sel.anchorNode, sel.extentNode];
    if(!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
      return undefined;
    else {
      var found = [0,0];
      var i;
      node_walk(elem, function(node) {
        for(i = 0; i < 2; i++) {
          if(node == nodes_to_find[i]) {
            found[i] = true;
            if(found[i == 0 ? 1 : 0])
              return false; // all done
          }
        }

        if(node.textContent && !node.firstChild) {
          for(i = 0; i < 2; i++) {
            if(!found[i])
              cum_length[i] += node.textContent.length;
          }
        }
      });
      cum_length[0] += sel.anchorOffset;
      cum_length[1] += sel.extentOffset;
    }
  }
  if(cum_length[0] <= cum_length[1])
    return cum_length;
  return [cum_length[1], cum_length[0]];
}