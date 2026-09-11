 import {useState,useEffect} from "react"

function Notesapp(){

//======STATES======

  const[title,settitle]=useState("")
  const[content,setcontent]=useState("")
  const[note,setnote]=useState(()=>{
  const savednotes=localStorage.getItem("notes")

  return savednotes ? JSON.parse(savednotes) : []
})
  const[editindex,seteditindex]=useState(null);
  const[color,setcolor]=useState("")
  const[category,setcategory]=useState("")
  const[search,setsearch]=useState("")
  const[filtercategory,setfiltercategory]=useState("all")
  const[sortby,setsortby]=useState("newest")
  const[archivestatus,setarchivestatus]=useState("active")
  const[selected,setselected]=useState([])
  const[loading,setloading]=useState(true)


  function clearform(){
  settitle("")
  setcontent("")
  setcolor("")
  setcategory("")
  seteditindex(null)
}
useEffect(()=>{
  localStorage.setItem("notes",JSON.stringify(note))
},[note])

useEffect(()=>{
  const timer=setTimeout(()=>{
    setloading(false)
  },500)

  return ()=>clearTimeout(timer)
},[])




  //=FUNCTIONS(add note)======

  function handlesubmit(){
    if(content.trim()===""){
      alert("Bro, you forgot the content!!! ")
      return;
    }
    if(title.length>100){
      alert("title is too long....")
      return;

    }
    if(content.length>1000){
      alert("content is too long....")
      return;
    }
    const duplicate = note.some((first) =>
  first.title.trim().toLowerCase() === title.trim().toLowerCase() &&
  first.content.trim().toLowerCase() === content.trim().toLowerCase()
)

if(duplicate){
  alert("This note already exists! ")
  return
}


    const newnote={
  title: title.trim(),
content: content.trim(),
  color,
  category,
  createdate:new Date().toISOString(),
  updatedate:new Date().toISOString(),
  pinned:false,
  archived:false
} 
    

    setnote([...note,newnote])

    settitle("")
    setcontent("")
    setcolor("")
    setcategory("")
  }
  //======FUNCTIONS(delete note)======

   function handledelete(index){

  const confirmdelete = window.confirm(
    "Are you sure you want to delete this note?"
  )

  if(!confirmdelete){
    return
  }

    const newnotes = note.filter((item,i) => i !== index)

  setnote(newnotes)
}
  function handleselect(index){

  if(selected.includes(index)){

    setselected(
      selected.filter((first)=>first !== index)
    )

  }else{

    setselected(
      [...selected,index]
    )

  }

}
function handlebulkdelete(){

  if(selected.length===0){
    alert("Select at least one note")
    return
  }

  const confirmdelete = window.confirm(
    `Are you sure you want to delete ${selected.length} note(s)?`
  )

  if(!confirmdelete){
    return
  }

  const remainingnotes = note.filter(
    (first,index)=>!selected.includes(index)
  )

  setnote(remainingnotes)

  setselected([])

}
 
  //====FUNCTION (pin,unpin)===
  function handlepin(index){

  const updatednotes=note.map((first,currentIndex)=>{

    if(currentIndex===index){

      return{
        ...first,
        pinned:!first.pinned
      }

    }

    return first
  })

  setnote(updatednotes)
}

//======FUNCTION(archive)====
 // ==================== ARCHIVE / UNARCHIVE ====================

function handlearchive(index){

  const updatednotes=note.map((first,currentIndex)=>{

    if(currentIndex===index){

      return{
        ...first,
        archived:!first.archived
      }

    }

    return first
  })

  setnote(updatednotes)
}
  
  //======FUNCTIONS(edit note)======

  function handleedit(index){
    const first =note[index]
    settitle(first.title)
    setcontent(first.content)
    setcolor(first.color)
    setcategory(first.category)
    

    seteditindex(index)

  }

  //====FUNCTION(update note)====
  function handleupdate(){
     if(content.trim()===""){
    alert("Bro, you forgot the content")
    return
  }

  if(title.length > 100){
    alert(" title is too long.. ")
    return
  }

  if(content.length > 1000){
    alert(" note is too long.. ")
    return
  }
   const duplicate = note.some((first,index) =>
    index !== editindex &&
    first.title.trim().toLowerCase() === title.trim().toLowerCase() &&
    first.content.trim().toLowerCase() === content.trim().toLowerCase()
  )

  if(duplicate){
    alert("Another note with the same title and content already exists!")
    return
  }

    const updatednotes=note.map((first,index)=>{
      if(index===editindex){
        return{
          ...first,
          title:title,
          content:content,
          color:color,
          category:category,
          createdate:first.createdate,
          updatedate:new Date().toLocaleString()
        }
      }
      return first
    })
    setnote(updatednotes)
    settitle("")
    setcontent("")
    setcolor("")
    setcategory("")
    seteditindex(null)
  }

  //===FUNCTIONS(search notes)===
  const searchnotes=note.filter((first)=>
  first.title.toLowerCase().includes(search.toLowerCase())||
first.content.toLowerCase().includes(search.toLowerCase())
)
//====FUNCTION(filter notes)====
const filternotes=searchnotes.filter((first)=>
  filtercategory==="all" || first.category===filtercategory
)
const archivednotes=filternotes.filter((first)=>
  archivestatus==="all" ||
  (archivestatus==="active" && first.archived===false) ||
  (archivestatus==="archived" && first.archived===true)
)
  const sortednotes = [...archivednotes].sort((a, b) => {

  if (a.pinned && !b.pinned) {
    return -1;
  }

  if (!a.pinned && b.pinned) {
    return 1;
  }

  if (sortby === "title") {
    return a.title.localeCompare(b.title);
  }

  if (sortby === "color") {
    return a.color.localeCompare(b.color);
  }

  if (sortby === "oldest") {
    return new Date(a.createdate) - new Date(b.createdate);
  }

  return new Date(b.createdate) - new Date(a.createdate);
});


  //=====DISPLAY PART=====

  return(
    <div className="min-h-screen bg-gray-100 p-6">

       <h1 className="text-3xl font-bold text-center mb-6">
  NOTES
</h1>

    <input
  type="text"
  placeholder="Search your notes..."
  value={search}
  onChange={(e)=>setsearch(e.target.value)}
  className="w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
/>
      <select
  value={filtercategory}
  onChange={(e)=>setfiltercategory(e.target.value)}
  className="p-3 border border-gray-300 rounded-xl bg-white shadow-sm outline-none"
>

  <option value="all">all categories</option>
  <option value="personal">personal</option>
  <option value="study">study</option>
  <option value="work">work</option>
</select>

<select
  value={archivestatus}
  onChange={(e)=>setarchivestatus(e.target.value)}
  className="p-3 border border-gray-300 rounded-xl bg-white shadow-sm outline-none"
>
  <option value="active">active notes</option>
  <option value="archived">archived notes</option>
  <option value="all">all notes</option>
</select>



      <input
        type="text"
        placeholder="title..."
        value={title}
        onChange={(e)=>settitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
      />
       <p className="text-sm text-gray-500 mt-1">
  {title.length}/100
</p>

      <div>
  <div className="flex gap-2 mb-2">

     <button
  type="button"
  onClick={() => setcontent(content + " **bold**")}
  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
>
  B
</button>

<button
  type="button"
  onClick={() => setcontent(content + " *italic*")}
  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg italic"
>
  I
</button>

<button
  type="button"
  onClick={() => setcontent(content + "\n• ")}
  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
>
  List
</button>

    <button
      type="button"
      onClick={() => setcontent(content + "\n• ")}
    >
      List
    </button>

  </div>
<textarea
  placeholder="What's on your mind?"
  value={content}
  onChange={(e)=>setcontent(e.target.value)}
  className="w-full h-32 p-3 border border-gray-300 rounded-xl shadow-sm outline-none resize-none focus:ring-2 focus:ring-blue-400"
 />

</div>
       <select
  value={category}
  onChange={(e)=>setcategory(e.target.value)}
  className="p-3 border border-gray-300 rounded-xl bg-white shadow-sm outline-none"
>
        <option value="">choose catecory</option>
        <option value="personal">personal</option>
        <option value="study">study</option>
        <option value="work">work</option>
      </select>

      <select
     value={sortby}
     onChange={(e) => setsortby(e.target.value)}
     className="p-3 border border-gray-300 rounded-xl bg-white shadow-sm outline-none"
>
  <option value="newest">newest</option>
  <option value="oldest">oldest</option>
  <option value="title">title</option>
  </select>

     <select
  value={color}
  onChange={(e)=>setcolor(e.target.value)}
  className="p-3 border border-gray-300 rounded-xl bg-white shadow-sm outline-none"
> 
        <option value="">pick a color</option>
        <option value="lightblue">blue</option>
  <option value="lightgreen">green</option>
  <option value="lightpink">pink</option>
  <option value="lavender">violet</option>
  <option value="lightyellow">yellow</option>
      </select>
      <p>{content.length}</p>

       {editindex === null ? (
   <button
  onClick={handlesubmit}
  className="px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-sm"
>
  Add Note
</button>
) : (
  <>
    <button onClick={handleupdate} className="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-sm">
      Update Note
    </button>

     <button onClick={clearform} className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-sm">
  Cancel
</button>
  </>
)} 

      <p>Total Notes: {sortednotes.length}</p>
      {selected.length > 0 && (
  <button onClick={handlebulkdelete} className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-sm">
    Delete Selected ({selected.length})
  </button>
)}


  {/*=====display notes*/} 
   {loading ? (
  <p className="text-center text-gray-500 text-lg mt-6">
    Loading notes...
  </p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

       {sortednotes.length === 0 ? (
  <p className="text-center text-gray-500 text-lg col-span-full">
    📝 No notes found. Create your first note!
  </p>
) : (
  sortednotes.map((first)=>(
        <div 
        key={note.indexOf(first)}
        style={{backgroundColor:first.color}}
          className="p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200"
        >
            <input
      type="checkbox"
      checked={selected.includes(note.indexOf(first))}
      onChange={()=>handleselect(note.indexOf(first))}
    />
           <h1 className="text-xl font-bold mb-2">
        {first.title}
    </h1>


           <div className="text-gray-700 mb-3 whitespace-pre-line">
  {first.content}
</div>
           <p className="inline-block bg-white/60 px-3 py-1 rounded-full text-sm font-medium mb-3">
          {first.category}
            </p>
           <p>
  Created: {new Date(first.createdate).toLocaleString()}
</p>

<p>
  Updated: {new Date(first.updatedate).toLocaleString()}
</p>

            <button
  className="bg-yellow-200 hover:bg-yellow-300 px-3 py-1 rounded-lg mr-2"
   onClick={() => handlepin(note.indexOf(first))}
>
  {first.pinned ? "Unpin" : "Pin"}
</button>

           <button
  className="bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded-lg mr-2"
  onClick={() => handlearchive(note.indexOf(first))}
>
  {first.archived ? "Unarchive" : "Archive"}
</button>


           <button
  className="bg-red-200 hover:bg-red-300 px-3 py-1 rounded-lg mr-2"
   onClick={() => handledelete(note.indexOf(first))}
>
  Delete
</button>

           <button
  className="bg-green-200 hover:bg-green-300 px-3 py-1 rounded-lg"
  onClick={() => handleedit(note.indexOf(first))}
>
  Edit
</button>

        </div>
      ))
    )}

 </div>
)}
 </div>
 
  )}
   
  
 
function App(){ 
     

  return(
    <div>
      <Notesapp/>
    </div>
  )
}

export default App