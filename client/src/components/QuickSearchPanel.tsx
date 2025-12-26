import { useState ,forwardRef , useImperativeHandle, useRef} from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerHeight: number;
}
interface QuickChat {
  id: string;
  promp: string;
  response: string;
}


const QuickSearchPanel  = forwardRef(({ isOpen, setIsOpen , headerHeight }:Props, ref) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [QuickChats, setQuickChats] = useState <QuickChat[]>([]);
  const [typingResponse, setTypingResponse] = useState<boolean>(false);
  const isTypingResponseRef = useRef<boolean>(false);


  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setQuickChats((prev)=>[...prev,{id:(prev.length+1).toString(),promp:query,response:""}]);

    setLoading(true);
    setTypingResponse(true);
    isTypingResponseRef.current = true;
    setQuery("");

try {
    //// Fetching stream from api
    const response = await fetch("http://192.168.29.241:11434/api/chat",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        model: "TinyLlama",
        messages: [{ role: "user", content: query }],
        stream: true,
      }),
    })

    if (!response.body) {
      setLoading(false);
      setQuickChats((prev)=>prev.map((chat)=>{
        if(chat.id=== (prev.length).toString()){
          return {...chat,response:"Some Error Occured" + query};
        } return chat;
      }));
    }

    else {
    const reader = response.body.pipeThrough(new TextDecoderStream('utf-8')).getReader();
    let currentText = "";
    setLoading(false);
    while(true){
      const { done, value } = await reader.read();
      if (done) break;
      else if(!isTypingResponseRef.current) break;
      let text = JSON.parse(value)["message"]["content"];
      currentText += text;
      console.log("Current Text:", currentText);
      setQuickChats((prev)=>prev.map((chat)=>{
        if(chat.id=== (prev.length).toString()){
          return {...chat,response:currentText};
        } return chat;
      }) );
    }
  }}
 catch (err) {
    console.error(err);
    setLoading(false);}

    }

    useImperativeHandle(ref, () => ({
    handleQuickSearch(prompt: string) {
      handleSearch(prompt);
    }
  }));


  return (
    <div
  className={`
    fixed top-[50px] right-0 z-40
    h-[calc(100vh-50px)]
    w-[300px]

    bg-white text-gray-900
    dark:bg-[#202123] dark:text-gray-100

    border-l border-gray-200
    dark:border-[#444654]

    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
>
  {/* Toggle Button */}
  <button
    onClick={() => setIsOpen((prev) => !prev)}
    className="
      absolute -left-6 top-1/2 -translate-y-1/2
      h-12 w-6 rounded-l-md

      bg-gray-200 text-gray-800
      hover:bg-gray-300

      dark:bg-[#40414F]
      dark:text-white
      dark:hover:bg-[#565869]

      flex items-center justify-center
      text-xs font-semibold

      border border-r-0 border-gray-300
      dark:border-[#444654]

      transition-colors
    "
    title="Toggle Quick Search"
  >
    {isOpen ? "<<" : ">>"}
  </button>

  {/* Header */}
  <div
    className="
      p-3 text-sm font-semibold

      border-b border-gray-200
      dark:border-[#444654]
    "
  >
    Quick Search
  </div>
<div className="overflow-y-auto
      [&::-webkit-scrollbar]:hidden
      [-ms-overflow-style:none]
      [scrollbar-width:none]
      max-h-[calc(100vh-156px)] ">
{QuickChats.length>0 && <ul> 
    {QuickChats.map((chat)=>(
      <li key={chat.id} className="p-2 border-b border-gray-200 dark:border-[#444654] hover:bg-gray-100 dark:hover:bg-[#343541] cursor-pointer">
       <span className="bg-gray-100 dark:bg-[#444654] w-full block">{chat.promp}</span> 
       <span className="bg-white dark:bg-[#212121]">{chat.response}</span>
      </li>
    ))}
  </ul>}

  {/* Result */}
  <div className="p-3 text-sm flex-1 overflow-y-auto">
    {loading ? (
      <p className="text-gray-500 dark:text-gray-400">
        Thinking...
      </p>
    ) : (null
    )}
  </div>
</div>
  {/* Search Input */}
 <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch(query);
  }}
  className="
    p-3 absolute bottom-0 w-full
    border-t border-gray-200
    dark:border-[#444654]
    bg-white
    dark:bg-[#202123]
  "
>
  <div className="relative w-full">
    <input
      className="
        w-full rounded-md px-3 py-2 pr-20 text-sm
        bg-gray-100 text-gray-900
        placeholder-gray-500
        outline-none
        focus:ring-2 focus:ring-blue-500
        dark:bg-[#40414F]
        dark:text-gray-100
        dark:placeholder-gray-400
        transition-colors
      "
      placeholder="One-line question..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />

    {/* Right-side icons */}
    <div className="absolute inset-y-0 right-2 flex items-center gap-2">
      {typingResponse ?
        <span
          className="cursor-pointer text-lg opacity-70 hover:opacity-100"
          onClick={() => {
            setTypingResponse(false);
            isTypingResponseRef.current = false;
          }}
          title="Pause response"
        >
          ⏸️
        </span>
        :<button
        type="submit"
        className="
          text-blue-600 dark:text-blue-400
          hover:opacity-80 transition
          cursor-pointer 
        "
        title="Send"
      >
        ➤
      </button> }
    </div>
  </div>
</form>

</div>

  );
})


export default QuickSearchPanel;