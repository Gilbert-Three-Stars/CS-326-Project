import {UserDB} from "../DBManager/UserDB.js";


const nameInput = document.getElementById("dataName");
const dataInput = document.getElementById("dataInput");
const createBtn = document.getElementById("createBtn");
const readBtn = document.getElementById("readBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const viewAllBtn = document.getElementById("viewAllBtn");
const response = document.getElementById("dataResponse");

const url = 'http://localhost:3000'
async function createData() {
    if(!nameInput.value || !dataInput.value){
        alert("Name/Input is required!");
    }else{
        try{
            const response = await fetch(`${url}/create?name${nameInput.value}`,{method: "POST"});
            const data = await response.text;
            // await db.save(nameInput.value, JSON.parse(dataInput.value));
        }catch(error){
            alert("Either duplicate creation or not valid data");
        }
    }
    viewAll();
}


async function readData() {
    if(!nameInput.value){
        alert("Name is required!");
    }else{
        try{
            const data = await db.load(nameInput.value);
            response.innerHTML = JSON.stringify(data);
        }catch(error){console.log(error);}
    }
}


async function updateData() {
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

async function deleteData() {
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

const db = new UserDB();


createBtn.addEventListener("click",async ()=>{
    await createData();
});
readBtn.addEventListener("click",async ()=>{
    await readData();
});
updateBtn.addEventListener("click",async ()=>{
    await updateData();
});
deleteBtn.addEventListener("click",async ()=>{
    await deleteData();
});
viewAllBtn.addEventListener("click",async ()=>{
    await viewAll();
});
// Load all counters in DB when page loads
await viewAll();


