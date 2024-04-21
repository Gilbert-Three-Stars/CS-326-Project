import {UserDB} from "../DBManager/UserDB.js";


const nameInput = document.getElementById("dataName");
const dataInput = document.getElementById("dataInput");
const createBtn = document.getElementById("createBtn");
const readBtn = document.getElementById("readBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const viewAllBtn = document.getElementById("viewAllBtn");
const response = document.getElementById("dataResponse");


async function createCounter() {
    if(!nameInput.value || !dataInput.value){
        alert("Name/Input is required!");
    }else{
        try{
            await db.save(nameInput.value, JSON.parse(dataInput.value));
        }catch(error){
            alert("Either duplicate creation or not valid data");
        }
    }
    viewAll();
}


async function readCounter() {
    if(!nameInput.value){
        alert("Name is required!");
    }else{
        try{
            const data = await db.load(nameInput.value);
            response.innerHTML = JSON.stringify(data);
        }catch(error){console.log(error);}
    }
}


async function updateCounter() {
    if(!nameInput.value|| !dataInput.value){
        alert("Name/Input is required!");
    }else{
        try{
        const data = await db.load(nameInput.value);
        data.data = JSON.parse(dataInput.value)
        await db.modify(data);
        }catch(error){
            alert("Not valid data");
        }
        viewAll();
    }

}

async function deleteCounter() {
    if(!nameInput.value){
        alert("Name is required!");
    }else{
        try{
            await db.delete(nameInput.value);
        }catch(error){}
        viewAll();
    }
}

async function viewAll() {
    try{
        const all = await db.loadAll();
        let responseText = "";
        all.forEach((data) => {
          responseText += `${data._id} = ${JSON.stringify(data.data)}<br>`;
        });
        response.innerHTML = responseText;
    }catch(error){}
}

let user = document.getElementById("profile").innerHTML;
const db = new UserDB(user);


createBtn.addEventListener("click",async ()=>{
    await createCounter();
});
readBtn.addEventListener("click",async ()=>{
    await readCounter();
});
updateBtn.addEventListener("click",async ()=>{
    await updateCounter();
});
deleteBtn.addEventListener("click",async ()=>{
    await deleteCounter();
});
viewAllBtn.addEventListener("click",async ()=>{
    await viewAll();
});
// Load all counters in DB when page loads
viewAll();