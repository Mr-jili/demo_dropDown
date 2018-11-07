/*
 *@author:jili 
 * description:组织机构
 *  */
var html = '';
var showFlag = 1;
//部门下拉展示效果begin
var structArray = [];
var struct = function () {
  var structId;
  var structCode;
  var structName;
  var parentId;
};

listStructMenuTree();

function listStructMenuTree(obj) {
  var data = '';
  var xhr = new XMLHttpRequest();
  xhr.open("get", "server.json", false);
  xhr.onreadystatechange = function () {
    console.log(xhr.status)
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.response).data_list;
    }
  }
  if (data == null || data == undefined || data == '') {
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 0) {
        data = JSON.parse(xhr.response).data_list;
      }
    }
  }
  xhr.send(null);
  var data_list = data;
  for (var i = 0; i < data_list.length; i++) {
    var notes = new struct();
    notes.structId = data_list[i].struct_id;
    notes.structCode = data_list[i].belong_city_code;
    notes.structName = data_list[i].struct_name;
    notes.parentId = data_list[i].parent_struct_id;
    structArray[i] = notes;
  }
  html = getStructList(-1);
}


//显示部门
function getStructList(parentId) {
  var result = "";
  var dataList = sortStructNote(getStructNoteByParentId(parentId));
  if (dataList.length > 0) {
    for (var i = 0; i < dataList.length; i++) {
      var notes = dataList[i];
      //			console.log(notes);
      var structName = notes.structName;
      var structId = notes.structId;
      var structCode = notes.structCode;
      var parentid = notes.parentId;
      result += getStructHtml(structId, structCode, structName, parentid);
      result += getStructList(structId);
      result += "</ul>";
      result += "</li>\r\n";
    }
  }
  return result;
}

//排序
function sortStructNote(dataList) {
  dataList.sort(function (a, b) {
    return a.noteId - b.noteId;
  });
  return dataList;
}

//根据父Id获取子部门
function getStructNoteByParentId(parentId) {
  var result = new Array();
  var tmpArr = new Array();
  for (var i = 0; i < structArray.length; i++) {
    var notes = structArray[i];
    if (notes.parentId == parentId) {
      result.push(notes);
    } else {
      tmpArr.push(notes);
    }
  }
  structArray = tmpArr;
  return result;
}

//获取展示部门的html代码
function getStructHtml(structId, structCode, structName, noteParentid) {
  var resultHtml = "";
  resultHtml += "<li>\r\n";
  resultHtml += "<div style='white-space:nowrap;'><span class='fa fa-plus' onclick='openChild(" + structId + ",this);' style='width:16px;cursor:pointer;'> + </span><a style='color:#000;text-decoration:none;cursor:pointer;list-style:none;' onclick='javascript:voluation(" + structId + ",\"" + structCode + "\",\"" + structName + "\",this);'>" + structName + "</a></div>";
  resultHtml += "<ul class='ul_level child_" + structId + "' style='margin-left:18px;display:none;'>";
  return resultHtml;
}


//显示部门
function getStructList(parentId) {
  var result = "";
  var dataList = sortStructNote(getStructNoteByParentId(parentId));
  if (dataList.length > 0) {
    for (var i = 0; i < dataList.length; i++) {
      var notes = dataList[i];
      //			console.log(notes);
      var structName = notes.structName;
      var structId = notes.structId;
      var structCode = notes.structCode;
      var parentid = notes.parentId;
      result += getStructHtml(structId, structCode, structName, parentid);
      result += getStructList(structId);
      result += "</ul>";
      result += "</li>\r\n";
    }
  }
  return result;
}


//打开子部门
function openChild(structId, obj) {
  if ($(".child_" + structId).is(":hidden")) {
    $(obj).addClass("fa-minus");
    $(obj).removeClass("fa-plus");
    $(".child_" + structId).show(); //如果元素为隐藏,则将它显现
  } else {
    $(obj).removeClass("fa-minus");
    $(obj).addClass("fa-plus");
    $(".child_" + structId).hide(); //如果元素为显现,则将其隐藏
  }
}


//点击部门执行
function voluation(structId, structCode, structName, obj) {
  $(obj).parents(".half").find(".section_input").val(structName);
  $(obj).parents(".half").find(".section_input").attr("struct_id", structId);
  $(obj).parents(".half").find(".section_input").attr("struct_code", structCode);
  $(obj).parents(".half").find(".section_input").attr("struct_name", structName);
  showFlag = 2;
}

//打开部门下拉框
function openSection(obj) {
  $('.section_box').css("display", "none");
  $(obj).next('.section_box').css("display", "inline-block");
  $(obj).next('.section_box').html(html);
}

//点击下拉框判断是否关闭
function stopPropagation(obj) {
  if (showFlag == 1) {
    $(obj).css("display", "inline-block");
  } else if (showFlag == 2) {
    $(obj).css("display", "none");
    showFlag = 1;
  }
}