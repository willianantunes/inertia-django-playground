import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

export default function Index({ users }) {
  return (
    <>
      <div>
        <h2 className='text-3xl font-bold underline'>This is the home page!</h2>
        <p className='text-lg font-mono'>Find it in 'frontend/js/pages/Index.jsx'</p>

        <p className='p-4'>
          You can also use Shadcn UI components. Learn more at <a href='https://ui.shadcn.com/docs'>Shadcn UI</a>.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='outline'>Show Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className='mt-8'>
          <h3 className='text-2xl font-semibold'>User List</h3>
          <table className='table-auto border-collapse border border-slate-500 w-full mt-4'>
            <thead>
              <tr>
                <th className='border border-slate-600 px-4 py-2'>ID</th>
                <th className='border border-slate-600 px-4 py-2'>Name</th>
                <th className='border border-slate-600 px-4 py-2'>Age</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className='border border-slate-700 px-4 py-2'>{user.id}</td>
                  <td className='border border-slate-700 px-4 py-2'>{user.name}</td>
                  <td className='border border-slate-700 px-4 py-2'>{user.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
