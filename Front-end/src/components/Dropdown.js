

export default function Dropdown({signout,email,userName}){
    return(
        <div class="z-50 absolute right-1 mt-8 w-[200px] my-4 bg-gradient-to-br from-slate-50 to-white divide-gray-100 rounded-lg shadow dark:bg-gray-700">
  <div className="px-4 py-3 text-base">
    <span className="text-sm mb-1 text-gray-900 dark:text-white font-semibold">
      {userName}
    </span>
    <span className="block text-sm text-gray-500 dark:text-gray-400">{email}</span>
  </div>
  <ul className="py-2" aria-labelledby="user-menu-button">
  <hr className="text-gray-500"/>
    <li>
      <button onClickCapture={signout} className="block px-4 py-2 text-sm text-red-600 text-semibold hover:underline dark:text-red-400 dark:hover:text-white">Sign out</button>
    </li> 
  </ul>
</div>
    )
}