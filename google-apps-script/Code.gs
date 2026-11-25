/**
 * KHAT BANDUNG — Google Apps Script backend starter.
 * Configure Script Properties: SPREADSHEET_ID, DRIVE_FOLDER_ID, ADMIN_EMAILS.
 * Production deployment must add verified authentication and authorization.
 */
const SHEETS = {
  Members: ['registerNo','fullName','nickname','generation','ktpAddress','currentAddress','phone','whatsapp','instagram','facebook','tiktok','vehicleType','vehicleColor','vehicleYear','plate','emergencyName','emergencyRelation','emergencyWhatsapp','photoUrl','status','createdAt','updatedAt'],
  Attendance: ['eventId','eventName','registerNo','memberName','timestamp','status'],
  Cash: ['id','date','type','description','amount','createdBy','createdAt'],
  Committee: ['position','name','period','photoUrl'],
  Events: ['eventId','title','date','place','description','createdBy','createdAt'],
  AuditLog: ['timestamp','actor','action','recordType','recordId']
};
function setupKhatSheets(){
  const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if(!id) throw new Error('Set SPREADSHEET_ID in Script Properties first.');
  const ss=SpreadsheetApp.openById(id);
  Object.entries(SHEETS).forEach(([name,headers])=>{
    let sh=ss.getSheetByName(name)||ss.insertSheet(name);
    if(sh.getLastRow()===0) sh.appendRow(headers);
  });
  return 'KHAT sheets ready';
}
function doGet(e){
  const action=(e&&e.parameter&&e.parameter.action)||'health';
  if(action==='health') return json({ok:true,app:'KHAT BANDUNG'});
  if(action==='publicMember'){
    const id=String(e.parameter.id||'').replace('KHAT-','');
    const m=findMember_(id);
    if(!m) return json({ok:false,error:'Member not found'});
    return json({ok:true,member:{registerNo:m.registerNo,fullName:m.fullName,nickname:m.nickname,generation:m.generation,vehicleType:m.vehicleType,vehicleColor:m.vehicleColor,vehicleYear:m.vehicleYear,plate:m.plate,status:m.status}});
  }
  return json({ok:false,error:'Unknown action'});
}
function doPost(e){
  try{
    const body=JSON.parse(e.postData.contents||'{}');
    const actor=Session.getActiveUser().getEmail();
    const admins=(PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS')||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
    const admin=admins.includes(String(actor).toLowerCase());
    if(body.action==='register') return json(registerMember_(body.member||{}));
    if(!admin) throw new Error('Admin permission required.');
    if(body.action==='saveCash') return json(saveCash_(body,actor));
    if(body.action==='saveEvent') return json(saveEvent_(body,actor));
    if(body.action==='saveCommittee') return json(saveCommittee_(body));
    throw new Error('Unknown action');
  }catch(err){return json({ok:false,error:String(err.message||err)});}
}
function registerMember_(m){
  const required=['fullName','nickname','whatsapp','vehicleType','plate','emergencyName','emergencyWhatsapp'];
  required.forEach(k=>{if(!m[k]) throw new Error('Missing field: '+k);});
  const sh=sheet_('Members');
  const reg=String(m.registerNo||nextRegister_()).padStart(3,'0');
  if(findMember_(reg)) throw new Error('Register number already exists.');
  const now=new Date();
  const headers=SHEETS.Members;
  const row=headers.map(k=>k==='registerNo'?reg:k==='status'?'Pending':k==='createdAt'||k==='updatedAt'?now:(m[k]||''));
  sh.appendRow(row);
  audit_('register','Member',reg);
  return {ok:true,registerNo:reg,status:'Pending'};
}
function saveCash_(b,actor){
  if(!b.description||!['Masuk','Keluar'].includes(b.type)||Number(b.amount)<=0) throw new Error('Invalid cash transaction.');
  const id=Utilities.getUuid();
  sheet_('Cash').appendRow([id,new Date(),b.type,b.description,Number(b.amount),actor,new Date()]);
  audit_('cash_'+b.type,'Cash',id);
  return {ok:true,id};
}
function saveEvent_(b,actor){
  if(!b.title||!b.date) throw new Error('Event title and date are required.');
  const id=Utilities.getUuid();
  sheet_('Events').appendRow([id,b.title,b.date,b.place||'',b.description||'',actor,new Date()]);
  audit_('create_event','Event',id);
  return {ok:true,eventId:id};
}
function saveCommittee_(b){
  if(!b.position||!b.name) throw new Error('Position and name required.');
  sheet_('Committee').appendRow([b.position,b.name,b.period||'',b.photoUrl||'']);
  audit_('update_committee','Committee',b.position);
  return {ok:true};
}
function findMember_(reg){
  const sh=sheet_('Members'), values=sh.getDataRange().getValues();
  if(values.length<2) return null;
  const headers=values.shift();
  const row=values.find(r=>String(r[headers.indexOf('registerNo')]).padStart(3,'0')===String(reg).padStart(3,'0'));
  if(!row) return null;
  return Object.fromEntries(headers.map((h,i)=>[h,row[i]]));
}
function nextRegister_(){
  const sh=sheet_('Members');
  return String(Math.max(0,sh.getLastRow()-1)+1).padStart(3,'0');
}
function sheet_(name){
  const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if(!id) throw new Error('SPREADSHEET_ID not configured');
  const sh=SpreadsheetApp.openById(id).getSheetByName(name);
  if(!sh) throw new Error('Run setupKhatSheets() first');
  return sh;
}
function audit_(action,type,id){
  sheet_('AuditLog').appendRow([new Date(),Session.getActiveUser().getEmail(),action,type,id]);
}
function json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
