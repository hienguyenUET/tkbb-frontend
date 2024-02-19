import Menu from './Menu'
import Footer from './Footer'
import Header from './Header'
import NotFound from './../pages/NotFound'

const Home = (props) => {
    return (
        <div className="wrapper">
            {props.path !== '/login'
                ? (
                    <>
                        <Header />
                        <Menu />
                    </>
                )
                : (<></>)
            }
            {props.match || <NotFound />}
            <Footer></Footer>
        </div>
    )
}

export default Home