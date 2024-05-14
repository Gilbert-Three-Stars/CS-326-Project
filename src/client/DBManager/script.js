
const nameInput = document.getElementById("dataName");
const dataInput = document.getElementById("dataInput");
const createBtn = document.getElementById("createBtn");
const readBtn = document.getElementById("readBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const viewAllBtn = document.getElementById("viewAllBtn");
const responseTextBox = document.getElementById("dataResponse");

const url = 'http://localhost:3000'

//function to handle data creation action
async function createData() {
    if(!nameInput.value || !dataInput.value){
        alert("Name/Input is required!");
    }else{
        try{
            await fetch(`${url}/create?name=${nameInput.value}&value=${JSON.stringify(dataInput.value)}`,{method: "POST"});
        }catch(error){
            alert("Either duplicate creation or not valid data");
        }
    }
    viewAll();
}

//function to read data action
async function readData() {
    if(!nameInput.value){
        alert("Name is required!");
    }else{
        try{
            const response = await fetch(`${url}/read?name=${nameInput.value}`,{method: "GET"});
            const runs = await response.text();
            responseTextBox.innerHTML = runs;
        }catch(error){console.log(error);}
    }
}

//function to update data
async function updateData() {
    if(!nameInput.value|| !dataInput.value){
        alert("Name/Input is required!");
    }else{
        try{
            await fetch(`${url}/update?name=${nameInput.value}&value=${JSON.stringify(dataInput.value)}`,{method: "PUT"});
        }catch(error){
            alert("Not valid data");
        }
        viewAll();
    }

}

//function to delete data
async function deleteData() {
    if(!nameInput.value){
        alert("Name is required!");
    }else{
        try{
            await fetch(`${url}/delete?name=${nameInput.value}`,{method:"DELETE"})
            //localhost:3000/delete?name=test
        }catch(error){}
        viewAll();
    }
}

//function to display all the data
async function viewAll() {
    try{
        const response = await fetch(`${url}/all`,{method:"GET"});
        const responseText = await response.text()
        responseTextBox.innerHTML = responseText;
    }catch(error){}
}


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


