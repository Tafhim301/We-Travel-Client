
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function UsersTableSkeleton() {
  return (
    <div className="rounded-md border border-border ">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableHead key={i}><Skeleton className="h-4 w-24" /></TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}