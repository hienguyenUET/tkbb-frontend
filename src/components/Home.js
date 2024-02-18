import Menu from './Menu'
import Footer from './Footer'
import Header from './Header'
import NotFound from './../pages/NotFound'

const Home = ({ path, match }) => {

    return (
        <div className="wrapper">
            {path !== '/login'
                ? (
                    <>
                        <Header />
                        <Menu />
                    </>
                )
                : (<></>)
            }
            {match || <NotFound />}
            <Footer></Footer>
        </div>
    )
}

export default Home