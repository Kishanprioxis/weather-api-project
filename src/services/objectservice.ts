import { error } from "console";
import api from "./api"
export interface ObjectModel{
   id: string;
  name: string;
  data?: Record<string, string | number | boolean | null>;
}


export async function getAllObjects() : Promise<ObjectModel[]>{
    const response = await api.get(`/objects`,{
    });
    console.log(response)
    if(response.status == 404){
        console.log("Error========="+response.data)
        return response.data
    }
    return response.data;
}

export interface AddBookRequest{
    title : string,
    author : string,
    isbn : string,
    publishedYear : number   
}

// export async function addBook(book: AddBookRequest): Promise<Book> {
//   try {
//     const response = await api.post(`/Book/createBook`, book);
//     if(response.status!=201){
//         throw new Error(response.data?.message || "Failed to add book");
//     }
//     console.log(response)
//     return response.data; 
//   } catch (error: any) {  
//     if(error.response && error.response.data){
//         throw error.response.data;
//     }  
//     console.error("Add Book API Error:", error.response?.data || error.message);
//     throw error;
//   }
// }
// export async function getBookBySid(booksid: string): Promise<Book>{
//     try{
//         const response = await api.get(`/Book/getBookBySId/${booksid}`);
//         console.log("Response======"+response)
//         if(response.status!=200){
//             throw new Error(response.data?.message || "Failed to get book");
//         }
//         return response.data;

//     }catch(error:any){
//         if(error.response && error.response.data){
//         throw error.response.data;
//     }  
//     console.error("Add Book API Error:", error.response?.data || error.message);
//     throw error;
//     }
// }
// export async function deleteBook(bookSid:string):Promise<void>{
//     try{
//         const response = await api.delete(`/Book/deleteBook/${bookSid}`);
//         console.log("Delete Response======"+response.data)
//         if(response.status!=204){
//             throw new Error(response.data?.message || "Failed to delete book");
//         }
//         return response.data;

//     }catch(error:any){
//         if(error.response && error.response.data){
//         throw error.response.data;
//     }  
//     console.error("Delete Book API Error:", error.response?.data || error.message);
//     throw error;
//     }   
    
// }
// export async function updateBook(booksSid:string,book: AddBookRequest): Promise<Book> {
//   try {
//     const response = await api.post(`/Book/updateBook/${booksSid}`, book);
//     if(response.status!=204){
//         throw new Error(response.data?.message || "Failed to update book");
//     }
//     console.log(response)
//     return response.data; 
//   } catch (error: any) {  
//     if(error.response && error.response.data){
//         throw error.response.data;
//     }  
//     console.error("Update Book API Error:", error.response?.data || error.message);
//     throw error;
//   }
    
// }