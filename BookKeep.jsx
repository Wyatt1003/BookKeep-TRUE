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