import { useRouter } from "next/router";
import Link from "next/link";
import { IoHome } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { AiOutlineProject } from "react-icons/ai";
import { CiShoppingTag } from "react-icons/ci";
import { SiGooglephotos } from "react-icons/si";
import { MdContactEmergency } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { useEffect, useState } from "react";

export default function Aside() {
  const router = useRouter();

  const [clicked, setClicked] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLinkClick = (link) => {
    setActiveLink((prevActive) => (prevActive === link ? null : link));
    setClicked(false);
  };

  useEffect(() => {
    // Update the active link based on the current route
    setActiveLink(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <aside className="asideleft active">
        <ul>
         {/* Dashboard */}
          <Link href='/'>
          <li className="navactive">
                <IoHome/>
                <span>Dashboard</span>
          </li>
          </Link>
          {/* Blogs Section */}
          <li
            className={`flex-col flex-left ${activeLink === "/blogs" ? "navactive" : ""}`}
            onClick={() => handleLinkClick("/blogs")}
          >
            <div className="flex gap-1">
              <BsPostcard />
              <span>Blogs</span>
            </div>
            {activeLink === "/blogs" && (
              <ul>
                <li>
                  <Link href="/blogs">All Blogs</Link>
                </li>
                <li>
                  <Link href="/blogs/draft">Draft Blogs</Link>
                </li>
                <li>
                  <Link href="/blogs/addblog">Add Blog</Link>
                </li>
              </ul>
            )}
          </li>
          {/* Projects Section */}
          <li
            className={`flex-col flex-left ${activeLink === "/projects" ? "navactive" : ""}`}
            onClick={() => handleLinkClick("/projects")}
          >
            <div className="flex gap-1">
            <AiOutlineProject />
              <span>Projects</span>
            </div>
            {activeLink === "/projects" && (
              <ul>
                <li>
                  <Link href="/projects">All Projects</Link>
                </li>
                <li>
                  <Link href="/projects/draftprojects">Draft Projects</Link>
                </li>
                <li>
                  <Link href="/projects/addproject">Add Project</Link>
                </li>
              </ul>
            )}
          </li>
          {/* Shop Section */}
          <li
            className={`flex-col flex-left ${activeLink === "/shops" ? "navactive" : ""}`}
            onClick={() => handleLinkClick("/shops")}
          >
            <div className="flex gap-1">
              <CiShoppingTag />
              <span>Shops</span>
            </div>
            {activeLink === "/shops" && (
              <ul>
                <li>
                  <Link href="/shops">All Products</Link>
                </li>
                <li>
                  <Link href="/shops/draftshop">Draft Products</Link>
                </li>
                <li>
                  <Link href="/shops/addproduct">Add Product</Link>
                </li>
              </ul>
            )}
          </li>
          {/* Gallery Section */}
          <li
            className={`flex-col flex-left ${activeLink === "/gallery" ? "navactive" : ""}`}
            onClick={() => handleLinkClick("/gallery")}
          >
            <div className="flex gap-1">
            <SiGooglephotos />
              <span>Gallery</span>
            </div>
            {activeLink === "/gallery" && (
              <ul>
                <li>
                  <Link href="/gallery">All Photos</Link>
                </li>
                <li>
                  <Link href="/gallery/addphoto">Add Photo</Link>
                </li>
              </ul>
            )}
          </li>
           {/* Contacts  */}
          <Link href='/contacts'>
          <li className={activeLink === '/contacts' ? 'navactive' : ''} onClick={() => {
                handleLinkClick('/contacts');
          }}>
                <MdContactEmergency />
                <span>Contacts</span>
          </li>
           {/* Setting */}
          </Link>
          <Link href='/setting'>
          <li className={activeLink === '/setting' ? 'navactive' : ''} onClick={() => {
                handleLinkClick('/settings');
          }}>
                <MdAdminPanelSettings />
                <span>Setting</span>
          </li>
          </Link>
        </ul>
      </aside>
    </>
  );
}
