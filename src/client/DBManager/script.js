import {UserDB} from "../DBManager/UserDB.js";


const dataInput = document.getElementById("dataName");
const createBtn = document.getElementById("createBtn");
const readBtn = document.getElementById("readBtn");
// const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const viewAllBtn = document.getElementById("viewAllBtn");
const response = document.getElementById("dataResponse");


async function createCounter() {
    if(dataInput.value === ""){
        alert("Counter name is required!");
    }else{
        try{
            await db.save(dataInput.value, 0);
        }catch(error){}
    }
    viewAll();
}


async function readCounter() {
    if(!dataInput.value){
        alert("Counter name is required!");
    }else{
        try{
            await db.load(dataInput.value);
        }catch(error){}
    }
    viewAll();
}


// async function updateCounter() {
//     if(!dataInput.value){
//         alert("Counter name is required!");
//     }else{
//         try{
//             await db.modify(data);
//         }catch(error){}
//     }

// }

async function deleteCounter() {
    if(!dataInput.value){
        alert("Counter name is required!");
    }else{
        try{
            await db.delete(dataInput.value);
        }catch(error){}
        viewAll();
    }
}

// TASK #4: Write event handler functions for each button
// Function to handle view all counters action
async function viewAll() {
    try{
        const all = await db.loadAll();
        let responseText = "";
        all.forEach((data) => {
          responseText += `${data._id} = ${data.data}<br>`;
        });
        response.innerHTML = responseText;
    }catch(error){}
}

let user = document.getElementById("user").innerHTML;
const db = new UserDB(user);

// TASK #5: Add event listeners
createBtn.addEventListener("click",async ()=>{
    await createCounter();
});
readBtn.addEventListener("click",async ()=>{
    await readCounter();
});
// updateBtn.addEventListener("click",async ()=>{
//     await updateCounter();
// });
deleteBtn.addEventListener("click",async ()=>{
    await deleteCounter();
});
viewAllBtn.addEventListener("click",async ()=>{
    await viewAll();
});
// Load all counters in DB when page loads
viewAll();