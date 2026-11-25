import {useEffect,useState} from "react";

const key="reading-tracker-books";
const accountKey="reading-tracker-accounts";
const currentKey="reading-tracker-current-account";
const num=(v,min,max=Infinity)=>Math.min(Math.max(Math.trunc(Number(v)||0),min),max);
const hash=async password=>{
	const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password));
	return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");
};

export default function BookKeep(){
	const [accounts,setAccounts]=useState(()=>{try{return JSON.parse(localStorage.getItem(accountKey)||"[]")}catch{return[]}});
	const [account,setAccount]=useState(()=>localStorage.getItem(currentKey)||"");
	const [accountMode,setAccountMode]=useState("create");
	const [name,setName]=useState("");
	const [email,setEmail]=useState("");
	const [password,setPassword]=useState("");
	const [accountError,setAccountError]=useState("");
	const [books,setBooks]=useState(()=>{
		try{
			const saved=JSON.parse(localStorage.getItem(key)||"[]");
			return Array.isArray(saved)?saved.map(b=>({...b,totalPages:num(b.totalPages,1),pagesRead:num(b.pagesRead??b.progress,0,num(b.totalPages,1))})):[];
		}catch{return[]}
	});
    st [title,setTitle]=useState("");
	const [read,setRead]=useState(0);
	const [total,setTotal]=useState(1);

	useEffect(()=>localStorage.setItem(key,JSON.stringify(books)),[books]);
	useEffect(()=>localStorage.setItem(accountKey,JSON.stringify(accounts)),[accounts]);
	useEffect(()=>{account?localStorage.setItem(currentKey,account):localStorage.removeItem(currentKey)},[account]);

	const submitAccount=async e=>{
		e.preventDefault();
		setAccountError("");
		const cleanEmail=email.trim().toLowerCase();
		if(!cleanEmail||password.length<6){
			setAccountError("Enter an email and a password of at least 6 characters.");
			return;
		}
		const digest=await hash(password);
		if(accountMode==="create"){
			if(!name.trim()){
				setAccountError("Enter a name.");
				return;
			}
			if(accounts.some(a=>a.email===cleanEmail)){
				setAccountError("An account with that email already exists.");
				return;
			}
			const newAccount={id:String(Date.now()+Math.random()),name:name.trim(),email:cleanEmail,password:digest};
			setAccounts(a=>[...a,newAccount]);
			setAccount(newAccount.id);
		}else{
			const found=accounts.find(a=>a.email===cleanEmail&&a.password===digest);
			if(!found){setAccountError("Email or password is incorrect.");return}
			setAccount(found.id);
		}
		setName("");setEmail("");setPassword("");
	};

	const add=e=>{
		e.preventDefault();
		if(!title.trim())return;
		const t=num(total,1),r=num(read,0,t);
		setBooks(b=>[...b,{id:Date.now()+Math.random(),title:title.trim(),pagesRead:r,totalPages:t}]);
		setTitle("");setRead(0);setTotal(1);
	};
	const edit=(id,field,value)=>{
		setBooks(bs=>bs.map(b=>{
			if(b.id!==id)return b;
			if(field==="totalPages"){
				const t=num(value,1);
				return{...b,totalPages:t,pagesRead:Math.min(b.pagesRead,t)};
            }}))}}