import {useFormStatus } from 'react-dom'

function AddBtn() {

    const { pending } = useFormStatus()
  return (
    <button
            disabled={pending}
              type="submit"
              className={`rounded-xl cursor-pointer  px-5 py-2.5 text-sm font-semibold  shadow-sm transition ${ pending ? "bg-slate-200 text-slate-800" : "hover:bg-white active:scale-[0.98] text-slate-950 bg-slate-100"}`}
            >
             { pending ? "Pending..." : "Publish Topic"}
    </button>
  )
}

export default AddBtn
