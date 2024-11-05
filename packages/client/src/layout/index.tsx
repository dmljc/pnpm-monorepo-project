import { NavLink, Outlet } from "react-router-dom";
const Layout = () => {
    return (
        <div>
            <NavLink to="/login">login</NavLink>
            <br />

            <NavLink to="/layout/home">home</NavLink>
            <br />
            <NavLink to="/layout/user">user</NavLink>

            <br />
            <NavLink to="/layout/book">book</NavLink>

            {/* 二级路由出口 */}
            <Outlet />
        </div>
    );
};
export default Layout;
