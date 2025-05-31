import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components";
import {
    ColumnsDirective,
    ColumnDirective,
    GridComponent,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers, getCurrentUser } from "~/appwrite/auth";

type UserData = {
    name: string;
    email: string;
    imageUrl: string;
    joinedAt: string;
    status: "user" | "admin";
};

const AllUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const user = await getCurrentUser();
            if (!user || user.status !== "admin") {
                navigate("/sign-in");
                return;
            }

            const { users: rawUsers, total } = await getAllUsers(20, 0);

            const mappedUsers: UserData[] = rawUsers
                .filter((u: any) =>
                    u.name && u.email && u.imageUrl && u.joinedAt && u.status
                )
                .map((u: any) => ({
                    name: u.name,
                    email: u.email,
                    imageUrl: u.imageUrl,
                    joinedAt: u.joinedAt,
                    status: u.status,
                }));

            setUsers(mappedUsers);
            setTotal(total);
        })();
    }, [navigate]);

    return (
        <main className="all-users wrapper p-6">
            <Header
                title="Manage Users"
                description={`View ${total} registered users.`}
            />

            {users.length === 0 ? (
                <p className="mt-6 text-gray-500 text-center">No users found.</p>
            ) : (
                <GridComponent dataSource={users} gridLines="None">
                    <ColumnsDirective>
                        <ColumnDirective
                            field="name"
                            headerText="Name"
                            width="200"
                            textAlign="Left"
                        />
                        <ColumnDirective
                            field="email"
                            headerText="Email"
                            width="250"
                            textAlign="Left"
                        />
                        <ColumnDirective
                            field="joinedAt"
                            headerText="Joined"
                            width="160"
                            textAlign="Left"
                            template={({ joinedAt }: UserData) => formatDate(joinedAt)}
                        />
                        <ColumnDirective
                            field="status"
                            headerText="Role"
                            width="120"
                            textAlign="Left"
                            template={({ status }: UserData) => (
                                <span
                                    className={cn(
                                        "rounded px-2 py-1 text-xs font-medium",
                                        status === "admin"
                                            ? "bg-yellow-200 text-yellow-800"
                                            : "bg-blue-100 text-blue-700"
                                    )}
                                >
                  {status}
                </span>
                            )}
                        />
                    </ColumnsDirective>
                </GridComponent>
            )}
        </main>
    );
};

export default AllUsers;
