var fs=require("fs");
var glob=require("globule");
var config,md=[];;

var readConfigFile=function(){
    return fs.readFileSync("./gitbook-config.json","utf-8");

};
config=JSON.parse(readConfigFile());
/**
 * 构造格式tab
 * @param level
 * @returns {string}
 */
var constructTab=function(level){
    var tabs="";
    if(level>0){
        while(level>0){
            tabs+="\t";
            level--;
        }
    }
    return "\n"+tabs+"* ";
};

/**
 * 分离路径中的文件名和上一级文件名
 * @param path
 * @returns {{dir: *, file: *}}
 */
var extractDirAndFile=function(path){
   var reg=/\/([^\/]*)\/([^\/\.]*)(\.[^\.]*)?$/g;
   return reg.exec(path);

};
/**
 * 映射文件中文名和英文名
 * @param englishName
 * @returns {*}
 */
var mappingName=function(englishName){
    var tempt=config["mappingDirname"][englishName];
    return tempt?tempt:englishName;
};

var traverseDir=function(includePath,excludePath,level){
    var files=glob.find(includePath.concat(excludePath));
    if(files.length>0){
        if(level==1){
            md.push(constructTab(0)+"["+mappingName(extractDirAndFile(includePath[0])[1])+"]");
        }
        files.forEach(function(value,index,array){
            console.log(value);
            var result=extractDirAndFile(value);
            var tabs=constructTab(level);
            if(result[3]){//说明是文件
                    md.push(tabs+"["+result[2]+"]("+value+")");
                }else{//说明是目录
                var dirname=mappingName(result[2]);
                md.push(tabs+"["+dirname+"]");
                traverseDir([(value+"/*")],excludePath,level+1);
            }
        });
    }else{
        return;
    }
};

var travesAllFiles=function(){
    var pathes=config["path"];
    pathes.forEach(function(value,index,array){
        console.log(value);
        traverseDir(value["include"],value["exclude"],1);
    });
    fs.writeFileSync("./SUMMARY.md",md.join(""));
};
travesAllFiles();
