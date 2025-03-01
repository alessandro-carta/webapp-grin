import React from "react";

function FooterPublic() {

    return (
        <footer className="bg-cblu-3 text-white p-4 fixed bottom-0 left-0 w-full">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold">
                    <img src="../public/logo-grin.png" alt="Logo GRIN" className="m-4 w-24"/>
                </div>
                <div className="text-right">
                    <p className="mb-2">Servizio bollino GRIN</p>
                    <a href="https://www.grin-informatica.it/" target="new" className="text-cgray-2 hover:text-cblu-2">Maggiori infomazioni</a>
                </div>
            </div>
        </footer>
    )

}
export default FooterPublic;