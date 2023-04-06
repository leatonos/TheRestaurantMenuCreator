import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import styles from "../styles/Profile.module.css"

export default function Profile() {
    
    const { user, error, isLoading } = useUser();
    const router = useRouter()
    const [userMenus,setUserMenus] = useState([])

    const getUserRestaurants = async() => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const userInfo = JSON.stringify({
          "ownerId": user.sub
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: userInfo,
          redirect: 'follow'
        };
        
        fetch("/api/restaurant", requestOptions)
          .then(response => response.json())
          .then(result => setUserMenus(result))
          .catch(error => console.log('error', error));

    }

    useEffect(()=>{

        if(isLoading){return}
        if(user){
            getUserRestaurants()
        }else{   
        router.push('/')
        }
    },[user])

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;


  function Logout() {
    return <a href="/api/auth/logout">Logout</a>;
   }
  
  function UserRestaurants(){

    function MenuItem(props){


        async function deleteMenu(userId,menu){

            const info = JSON.stringify({
                "userId": userId,
                "menuInfo":menu
              });

            
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: info,
              redirect: 'follow'
            };
            
            fetch("/api/deleteMenu", requestOptions)
              .then(response => response.json())
              .then(result => getUserRestaurants())
              .catch(error => console.log('error', error));

              
        }

        return(
            <div className={styles.menuContainer}>
                
                <div className={styles.qrCodeContainer}>
                  <QRCode
                    size={256}
                    className={styles.qrCode}
                    value={'/restaurant/'+props.menuInfo._id}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <div className={styles.menuInfoContainer}>
                  <h3>{props.menuInfo.restaurantName}</h3>
                <div className={styles.menuOptions}>
                  <Link href={{pathname: '/restaurant/'+props.menuInfo._id}}>
                    <button>Preview</button>
                  </Link>
                  <Link href={{pathname: '/restaurant-creator/'+props.menuInfo._id}}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => deleteMenu(user.sub,props.menuInfo)}>Delete</button>
                </div>
                  
                </div>
               
            </div>
        )
    }

    return (
        <div className={styles.menuListContainer}>
            {userMenus.map((menu,index) =>
              <MenuItem menuInfo={menu} key={index}/>
            )}
        </div>
    )
  } 


  return (
      user && (
          <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{user.sub}</p>
            <Link
                href={{
                    pathname: '/restaurant-creator'
                }}
                >
                <button>Create Restaurant</button>
            </Link>
            <Link
                href={{
                    pathname: '/api/auth/logout'
                }}
                >
                <button>Logout</button>
            </Link>

            <UserRestaurants/>

          </div>
      )
  );
}