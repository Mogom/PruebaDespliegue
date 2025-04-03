// Vars
const HeaderWeb = {
    "Content-Type": "application/x-www-form-urlencoded",
}

// Functions 
// Traer datos
export async function GetData(URL) {
    try {
        const response = await fetch(URL,{
            method: "GET",
            headers: HeaderWeb,
        })
        if (!response.ok) {
            response.status >= 500? window.location.href = "/internal":
            window.location.href = "/notfound"
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data.result[0]
    } catch (error) {
        window.location.href = "/internal"
        console.error("Error:", error)
        throw error
    }
}
// Enviar datos 
export async function PostData(URL,datas) {
    try {
        const response = await fetch(URL,{
            method:"POST",
            headers: HeaderWeb,
            body: JSON.stringify(datas),

        })
        if (!response.ok) {
            response.status >= 500? window.location.href = "/internal":
            window.location.href = "/notfound"
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data.result[0]
    } catch (error) {
        window.location.href = "/internal"
        console.error("Error:", error)
        throw error
    }
}
