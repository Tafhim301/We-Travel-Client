import Dashboard from "@/components/modules/dashboard/dashboard";


export default function layout({children} : {children : React.ReactNode}) {
  return (
    <Dashboard>
      {children}
    </Dashboard>
  )
}
