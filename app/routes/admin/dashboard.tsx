import { Header, StatsCard, TripCard } from "../../../components";
import { getAllUsers, getCurrentUser } from "~/appwrite/auth";
import type { Route } from './+types/dashboard';
import {
    getTripsByTravelStyle,
    getUserGrowthPerDay,
    getUsersAndTripsStats
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import ThemeToggle from "../../../components/ThemeToggle";

import {
    Category,
    ChartComponent,
    ColumnSeries,
    DataLabel,
    SeriesCollectionDirective,
    SeriesDirective,
    SplineAreaSeries,
    Tooltip,
    Legend
} from "@syncfusion/ej2-react-charts";
import {
    ColumnDirective,
    ColumnsDirective,
    GridComponent,
    Inject
} from "@syncfusion/ej2-react-grids";

import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants";
import { redirect } from "react-router";

export const clientLoader = async () => {
    const user = await getCurrentUser();

    if (!user || user.status !== 'admin') {
        console.warn('❌ Unauthorized access to dashboard');
        return redirect('/');
    }

    try {
        const [
            dashboardStats,
            trips,
            userGrowth,
            tripsByTravelStyle,
            allUsers
        ] = await Promise.all([
            getUsersAndTripsStats(),
            getAllTrips(4, 0),
            getUserGrowthPerDay(),
            getTripsByTravelStyle(),
            getAllUsers(4, 0)
        ]);

        const allTrips = trips?.allTrips?.map(({ $id, tripDetails, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? []
        })) ?? [];

        const mappedUsers: UsersItineraryCount[] = allUsers?.users?.map((user) => ({
            imageUrl: user.imageUrl,
            name: user.name,
            count: user.itineraryCount ?? Math.floor(Math.random() * 10)
        })) ?? [];

        return {
            user,
            dashboardStats,
            allTrips,
            userGrowth,
            tripsByTravelStyle,
            allUsers: mappedUsers
        };
    } catch (error) {
        console.error("❌ Failed to load dashboard data:", error);
        return redirect('/');
    }
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const user = loaderData.user;
    const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } = loaderData;

    const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interest: trip.interests
    }));

    const usersAndTrips = [
        {
            title: 'Latest user signups',
            dataSource: allUsers,
            field: 'count',
            headerText: 'Trips created'
        },
        {
            title: 'Trips based on interests',
            dataSource: trips,
            field: 'interest',
            headerText: 'Interests'
        }
    ];

    return (
        <main className="pt-8 px-6 space-y-12 bg-white-100 min-h-screen overflow-x-hidden">
            <Header
                title={`Welcome ${user?.name ?? 'Guest'} 👋`}
                description="Track activity, trends and popular destinations in real time"
            />

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <StatsCard
                    headerTitle="Total Users"
                    total={dashboardStats.totalUsers}
                    currentMonthCount={dashboardStats.usersJoined.currentMonth}
                    lastMonthCount={dashboardStats.usersJoined.lastMonth}
                />
                <StatsCard
                    headerTitle="Total Trips"
                    total={dashboardStats.totalTrips}
                    currentMonthCount={dashboardStats.tripsCreated.currentMonth}
                    lastMonthCount={dashboardStats.tripsCreated.lastMonth}
                />
                <StatsCard
                    headerTitle="Active Users"
                    total={dashboardStats.userRole.total}
                    currentMonthCount={dashboardStats.userRole.currentMonth}
                    lastMonthCount={dashboardStats.userRole.lastMonth}
                />
            </section>

            <section>
                <h1 className="text-xl font-semibold text-dark-100 mb-4">Created Trips</h1>
                <div className="trip-grid">
                    {allTrips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id.toString()}
                            name={trip.name!}
                            imageUrl={trip.imageUrls[0] || "/assets/images/card-img.png"} // ✅ fallback added
                            location={trip.itinerary?.[0]?.location ?? ''}
                            tags={[trip.interests!, trip.travelStyle!]}
                            price={trip.estimatedPrice!}
                        />
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartComponent
                    id="chart-1"
                    primaryXAxis={userXAxis}
                    primaryYAxis={useryAxis}
                    title="User Growth"
                    tooltip={{ enable: true }}
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip, Legend]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName="day"
                            yName="count"
                            type="Column"
                            name="Column"
                            columnWidth={0.3}
                            cornerRadius={{ topLeft: 10, topRight: 10 }}
                        />
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName="day"
                            yName="count"
                            type="SplineArea"
                            name="Wave"
                            fill="rgba(71, 132, 238, 0.3)"
                            border={{ width: 2, color: '#4784EE' }}
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>

                <ChartComponent
                    id="chart-2"
                    primaryXAxis={tripXAxis}
                    primaryYAxis={tripyAxis}
                    title="Trip Trends"
                    tooltip={{ enable: true }}
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip, Legend]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={tripsByTravelStyle}
                            xName="travelStyle"
                            yName="count"
                            type="Column"
                            name="day"
                            columnWidth={0.3}
                            cornerRadius={{ topLeft: 10, topRight: 10 }}
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
            </section>

            <section className="space-y-8">
                {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
                    <div key={i} className="flex flex-col gap-5">
                        <h3 className="p-20-semibold text-dark-100">{title}</h3>
                        <GridComponent dataSource={dataSource} gridLines="None">
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="name"
                                    headerText="Name"
                                    width="200"
                                    textAlign="Left"
                                    template={(props: UserData) => (
                                        <div className="flex items-center gap-1.5 px-4">

                                            <span>{props.name}</span>
                                        </div>
                                    )}
                                />
                                <ColumnDirective
                                    field={field}
                                    headerText={headerText}
                                    width="150"
                                    textAlign="Left"
                                />
                            </ColumnsDirective>
                        </GridComponent>
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Dashboard;
