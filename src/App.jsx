import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Home, Users, CreditCard, QrCode, Wallet, CalendarDays, Shield, Menu, Bike, Plus, Search, LogOut, Camera, UserRound, ClipboardList, ChevronRight } from 'lucide-react';

const initialMember = {
  registerNo:'001', fullName:'Contoh Anggota KHAT', nickname:'Contoh', generation:'2026',
  ktpAddress:'Bandung', currentAddress:'Bandung', phone:'08xxxxxxxxxx', whatsapp:'08xxxxxxxxxx',
  instagram:'@khatbandung', facebook:'', tiktok:'', vehicleType:'Karisma X',
  vehicleColor:'Hitam', vehicleYear:'2005', plate:'D 0000 KH', emergencyName:'Kontak Darurat',
  emergencyRelation:'Keluarga', emergencyWhatsapp:'08xxxxxxxxxx'
};
const nav = [
  ['Beranda',Home],['Data Anggota',Users],['Kartu Anggota',CreditCard],['Absensi Event',QrCode],
  ['Kas Komunitas',Wallet],['Kepengurusan',Shield],['Agenda',CalendarDays],['Profil',UserRound]
];
export default function App(){
  const [page,setPage]=useState('Beranda');
  const [role,setRole]=useState('anggota');
  const [member,setMember]=useState(initialMember);
  const [members,setMembers]=useState([initialMember]);
  const [search,setSearch]=useState('');
  const [transactions,setTransactions]=useState([]);
  const [events,setEvents]=useState([{title:'Kopdar Rutin KHAT',date:'Menunggu jadwal',place:'Bandung',desc:'Agenda akan diperbarui oleh admin.'}]);
  const [committee,setCommittee]=useState([{position:'Ketua',name:'Belum diisi'},{position:'Wakil Ketua',name:'Belum diisi'},{position:'Sekretaris',name:'Belum diisi'},{position:'Bendahara',name:'Belum diisi'}]);
  const [notice,setNotice]=useState('Selamat Datang Di Keluarga KHAT BANDUNG.');
  const [showForm,setShowForm]=useState(false);
  const [tx,setTx]=useState({type:'Masuk',description:'',amount:''});
  const [eventDraft,setEventDraft]=useState({title:'',date:'',place:'',desc:''});
  const [cashDraft,setCashDraft]=useState(false);
  const [attendance,setAttendance]=useState([]);
  const [scanned,setScanned]=useState('');
  const [profilePhoto,setProfilePhoto]=useState('');
  const [login,setLogin]=useState(false);
  const qrValue=useMemo(()=>JSON.stringify({app:'KHAT BANDUNG',memberId:'KHAT-'+member.registerNo,registerNo:member.registerNo}),[member]);
  const totalIn=transactions.filter(x=>x.type==='Masuk').reduce((a,b)=>a+b.amount,0);
  const totalOut=transactions.filter(x=>x.type==='Keluar').reduce((a,b)=>a+b.amount,0);
  const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
  const update=(k,v)=>setMember(m=>({...m,[k]:v}));
  const saveMember=async()=>{
  try{
    const response=await fetch(''/api/register',{
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({action:'register',member})
    });
    const result=await response.json();
    if(!result.ok) throw new Error(result.error||'Gagal menyimpan');
    setMembers(a=>[...a.filter(x=>x.registerNo!==result.registerNo),{...member,registerNo:result.registerNo}]);
    setShowForm(false);
    setNotice('Pendaftaran berhasil dikirim. Status menunggu persetujuan.');
  }catch(error){
    setNotice('Gagal menyimpan: '+error.message);
  }
};
  const field=(label,key,placeholder='',type='text')=><label className="field"><span>{label}</span><input type={type} value={member[key]||''} placeholder={placeholder} onChange={e=>update(key,e.target.value)}/></label>;
  const admin=role==='admin';
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brandmark"><Bike size={25}/></div><div><b>KHAT BANDUNG</b><small>KARISMA HONDA AUTOMOTIVE TEAM</small></div></div>
      <div className="welcome"><span>PORTAL KOMUNITAS</span><h2>Solidarity.<br/>Brotherhood.</h2><p>{notice}</p></div>
      <nav>{nav.map(([n,I])=><button key={n} className={page===n?'active':''} onClick={()=>{setPage(n);setShowForm(false)}}><I size={18}/>{n}<ChevronRight size={15}/></button>)}</nav>
      <div className="rolebox"><span>MODE AKSES</span><select value={role} onChange={e=>setRole(e.target.value)}><option value="anggota">Anggota</option><option value="admin">Admin (demo)</option></select><small>Pengalih mode ini hanya untuk pratinjau, bukan autentikasi produksi.</small></div>
    </aside>
    <main className="main">
      <header><div><span className="eyebrow">KARISMA HONDA AUTOMOTIVE TEAM</span><h1>{page}</h1></div><div className="headright"><span className="statusdot"/> Sistem Komunitas <div className="avatar">K</div></div></header>
      <div className="content">
      {page==='Beranda'&&<><section className="hero"><div><span className="tag">WELCOME TO KHAT FAMILY</span><h2>Selamat Datang Di<br/><em>Keluarga KHAT BANDUNG.</em></h2><p>Ruang digital untuk menjaga data anggota, mempererat persaudaraan, dan mengelola kegiatan komunitas.</p><button className="primary" onClick={()=>setPage('Kartu Anggota')}>Lihat Kartu Anggota <ChevronRight size={17}/></button></div><div className="hero-bike"><Bike size={116}/><b>KHAT<br/>BANDUNG</b><small>RIDE • RESPECT • BROTHERHOOD</small></div></section>
      <div className="stats"><Stat label="Total Anggota" value={members.length} icon={<Users/>}/><Stat label="Agenda Aktif" value={events.length} icon={<CalendarDays/>}/><Stat label="Saldo Kas" value={money(totalIn-totalOut)} icon={<Wallet/>}/></div>
      <div className="grid2"><section className="panel"><PanelTitle title="Menu Cepat" sub="Akses fitur komunitas"/><div className="quick">{[['Daftar Anggota',Users,'Data Anggota'],['Kartu Digital',CreditCard,'Kartu Anggota'],['Scan Kehadiran',QrCode,'Absensi Event'],['Laporan Kas',Wallet,'Kas Komunitas']].map(([t,I,p])=><button onClick={()=>setPage(p)}><I/><span>{t}</span><ChevronRight size={15}/></button>)}</div></section><section className="panel"><PanelTitle title="Agenda Terdekat" sub="Informasi kegiatan komunitas"/>{events.slice(0,2).map(e=><div className="eventline"><div className="eventicon"><CalendarDays/></div><div><b>{e.title}</b><small>{e.date} • {e.place}</small></div></div>)}</section></div></>}
      {page==='Data Anggota'&&<section className="panel"><PanelTitle title="Database Anggota" sub="Pendaftaran dan data keanggotaan"/><div className="toolbar"><div className="search"><Search size={17}/><input placeholder="Cari nama atau nomor register..." value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="primary" onClick={()=>{setShowForm(true);setMember({...initialMember,registerNo:String(members.length+1).padStart(3,'0'),fullName:'',nickname:''})}}><Plus size={17}/> Daftar Anggota</button></div>
      {showForm?<div className="formwrap"><h3>Formulir Pendaftaran Anggota</h3><p className="muted">Lengkapi data berikut. Foto anggota wajib menggunakan atribut/merchandise KHAT.</p><h4>01 — Data Diri</h4><div className="formgrid">{field('Nomor Register','registerNo','Contoh: 000')}{field('Nama lengkap sesuai KTP','fullName')}{field('Nama panggilan','nickname')}{field('Makra / Angkatan','generation')}{field('Alamat sesuai KTP','ktpAddress')}{field('Alamat tempat tinggal sekarang','currentAddress')}{field('Nomor telepon','phone')}{field('Nomor WhatsApp','whatsapp')}{field('Instagram','instagram')}{field('Facebook','facebook')}{field('TikTok','tiktok')}</div><h4>02 — Data Kendaraan</h4><div className="formgrid"><label className="field"><span>Jenis kendaraan</span><select value={member.vehicleType} onChange={e=>update('vehicleType',e.target.value)}><option>Karisma X</option><option>Karisma D</option><option>Lainnya</option></select></label>{field('Warna kendaraan','vehicleColor')}{field('Tahun kendaraan','vehicleYear')}{field('Nopol kendaraan','plate')}</div><h4>03 — Kontak Darurat</h4><div className="formgrid">{field('Nama','emergencyName')}{field('Status hubungan','emergencyRelation')}{field('Nomor WhatsApp','emergencyWhatsapp')}</div><h4>04 — Foto Anggota</h4><label className="upload"><Camera/><span>{profilePhoto?'Foto dipilih':'Pilih foto selfie terbaru 2026 dengan atribut KHAT'}</span><input type="file" accept="image/*" onChange={e=>setProfilePhoto(e.target.files?.[0]?.name||'')}/></label><div className="actions"><button className="ghost" onClick={()=>setShowForm(false)}>Batal</button><button className="primary" onClick={saveMember}>Simpan Data Anggota</button></div></div>:<div className="tablewrap"><table><thead><tr><th>Register</th><th>Nama Anggota</th><th>Angkatan</th><th>Kendaraan</th><th>Status</th></tr></thead><tbody>{members.filter(m=>(m.fullName+m.registerNo).toLowerCase().includes(search.toLowerCase())).map(m=><tr><td>KHAT-{m.registerNo}</td><td><b>{m.fullName}</b><small>{m.nickname}</small></td><td>{m.generation}</td><td>{m.vehicleType}</td><td><span className="pill">Aktif (demo)</span></td></tr>)}</tbody></table></div>}</section>}
      {page==='Kartu Anggota'&&<div className="cardarea"><div className="membercard"><div className="cardtop"><div><b>KHAT BANDUNG</b><small>KARISMA HONDA AUTOMOTIVE TEAM</small></div><Bike size={29}/></div><div className="cardbody"><div className="photo"><UserRound size={42}/><small>FOTO ANGGOTA</small></div><div className="memberinfo"><small>IDENTITAS ANGGOTA</small><h2>{member.fullName||'Nama Anggota'}</h2><b>KHAT-{member.registerNo}</b><span>Makra / Angkatan: {member.generation}</span><span>Kendaraan: {member.vehicleType}</span><span>Nopol: {member.plate}</span><label>ANGGOTA KHAT BANDUNG</label></div></div><div className="cardbottom"><span>RIDE • RESPECT • BROTHERHOOD</span><div className="qrwhite"><QRCodeSVG value={qrValue} size={72}/></div></div></div><section className="panel cardnote"><h3>Kartu Anggota Digital</h3><p>QR pada kartu contoh ini memuat ID anggota. Saat backend aktif, QR akan diarahkan ke halaman verifikasi publik yang hanya menampilkan data aman.</p><button className="ghost" onClick={()=>setPage('Data Anggota')}>Kelola data anggota</button></section></div>}
      {page==='Absensi Event'&&<section className="panel"><PanelTitle title="Absensi Kegiatan" sub="Pencatatan kehadiran berbasis QR Code"/><div className="scanbox"><QrCode size={54}/><h3>Scan QR Anggota</h3><p>Masukkan ID/nomor register untuk simulasi pencatatan. Pemindai kamera perlu diaktifkan saat integrasi backend.</p><div className="scaninput"><input value={scanned} onChange={e=>setScanned(e.target.value)} placeholder="Contoh: 001"/><button className="primary" onClick={()=>{const m=members.find(x=>x.registerNo===scanned||('KHAT-'+x.registerNo)===scanned);if(m&&!attendance.includes(m.registerNo))setAttendance(a=>[...a,m.registerNo]);setNotice(m?'Absensi anggota berhasil dicatat pada pratinjau.':'Anggota tidak ditemukan atau sudah tercatat.')}}>Catat Hadir</button></div><small>{notice}</small></div><h3>Daftar Hadir Sesi Ini</h3>{attendance.length?attendance.map(a=><div className="eventline"><div className="eventicon"><Users/></div><b>KHAT-{a}</b><span className="pill">Hadir</span></div>):<p className="muted">Belum ada kehadiran tercatat.</p>}</section>}
      {page==='Kas Komunitas'&&<section className="panel"><PanelTitle title="Transparansi Kas" sub="Laporan pemasukan dan pengeluaran komunitas"/><div className="stats"><Stat label="Pemasukan" value={money(totalIn)} icon={<Plus/>}/><Stat label="Pengeluaran" value={money(totalOut)} icon={<Wallet/>}/><Stat label="Saldo Akhir" value={money(totalIn-totalOut)} icon={<Wallet/>}/></div>{admin&&<button className="primary" onClick={()=>setCashDraft(!cashDraft)}><Plus size={16}/> Tambah Transaksi</button>}{cashDraft&&<div className="formgrid compact"><label className="field"><span>Jenis transaksi</span><select value={tx.type} onChange={e=>setTx({...tx,type:e.target.value})}><option>Masuk</option><option>Keluar</option></select></label><label className="field"><span>Keterangan</span><input value={tx.description} onChange={e=>setTx({...tx,description:e.target.value})}/></label><label className="field"><span>Nominal (Rp)</span><input type="number" value={tx.amount} onChange={e=>setTx({...tx,amount:e.target.value})}/></label><button className="primary" onClick={()=>{if(tx.description&&Number(tx.amount)>0){setTransactions(a=>[...a,{...tx,amount:Number(tx.amount),date:new Date().toLocaleDateString('id-ID')}]);setCashDraft(false);}}}>Simpan Transaksi</button></div>}<div className="tablewrap"><table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Jenis</th><th>Nominal</th></tr></thead><tbody>{transactions.map(t=><tr><td>{t.date}</td><td>{t.description}</td><td>{t.type}</td><td>{money(t.amount)}</td></tr>)}</tbody></table></div>{!admin&&<p className="muted">Hanya admin/bendahara yang dapat menambah atau mengubah transaksi.</p>}</section>}
      {page==='Kepengurusan'&&<section className="panel"><PanelTitle title="Struktur Kepengurusan" sub="Periode kepengurusan KHAT BANDUNG"/>{committee.map(c=><div className="committee"><div className="committeeavatar"><UserRound/></div><div><small>{c.position}</small><b>{c.name}</b></div>{admin&&<button className="ghost small" onClick={()=>{const v=prompt('Nama '+c.position,c.name);if(v!==null)setCommittee(a=>a.map(x=>x.position===c.position?{...x,name:v}:x))}}>Ubah</button>}</div>)}</section>}
      {page==='Agenda'&&<section className="panel"><PanelTitle title="Agenda & Event" sub="Kegiatan resmi komunitas"/>{admin&&<button className="primary" onClick={()=>setEventDraft({title:'',date:'',place:'',desc:''})}><Plus size={16}/> Buat Agenda</button>}{admin&&<div className="formgrid compact">{[['Nama kegiatan','title'],['Tanggal','date'],['Lokasi','place'],['Keterangan','desc']].map(([l,k])=><label className="field"><span>{l}</span><input value={eventDraft[k]} onChange={e=>setEventDraft({...eventDraft,[k]:e.target.value})}/></label>)}<button className="primary" onClick={()=>{if(eventDraft.title)setEvents(a=>[eventDraft,...a]);setEventDraft({title:'',date:'',place:'',desc:''})}}>Simpan Agenda</button></div>}{events.map(e=><div className="agenda"><div className="datebox"><CalendarDays/></div><div><b>{e.title}</b><small>{e.date} • {e.place}</small><p>{e.desc}</p></div></div>)}</section>}
      {page==='Profil'&&<section className="panel"><PanelTitle title="Profil Anggota" sub="Informasi akun dan identitas"/><div className="profilehead"><div className="bigavatar"><UserRound/></div><div><h2>{member.fullName}</h2><span>KHAT-{member.registerNo}</span></div></div><div className="profiledetails"><p><b>Nama panggilan</b>{member.nickname}</p><p><b>WhatsApp</b>{member.whatsapp}</p><p><b>Kendaraan</b>{member.vehicleType} — {member.plate}</p><p><b>Angkatan</b>{member.generation}</p></div><button className="primary" onClick={()=>{setPage('Data Anggota');setShowForm(true)}}>Ajukan Perubahan Data</button></section>}
      </div>
      <footer>© 2026 KHAT BANDUNG · Karisma Honda Automotive Team <span>Prototype / Development Preview</span></footer>
    </main>
  </div>
}
function Stat({label,value,icon}){return <div className="stat"><div className="staticon">{icon}</div><div><small>{label}</small><b>{value}</b></div></div>}
function PanelTitle({title,sub}){return <div className="paneltitle"><div><h3>{title}</h3><p>{sub}</p></div><span className="accentline"/></div>}
