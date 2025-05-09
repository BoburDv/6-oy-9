export const fetchData = async ()=>{
    const res = await fetch("https://json-api.uz/api/project/fn37/todos")
    if(res.status !== 200){
        throw new Error(res.status);
    }
    return res.json()
}

export const deleteData = async (id)=>{
    const res = await fetch(`https://json-api.uz/api/project/fn37/todos/${id}`, {
        method: "DELETE"
    })
    if(res.status !== 200){
        throw new Error(res.status);
    }
    return res.json()
}

export const addData = async (data) => {
    const res = await fetch("https://json-api.uz/api/project/fn37/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
};
