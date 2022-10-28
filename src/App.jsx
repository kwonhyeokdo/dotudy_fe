import { isEmpty, toServer } from "utils/common";
import React from "react";
import { IntlProvider } from "react-intl";
import { Route, Routes } from "react-router-dom";
import { StackLayout } from "layout/StackLayout";
import { LabelSetting } from "pages/system/LabelSetting/LabelSetting";

localStorage.setItem("locale", navigator.language || navigator.userLanguage);

function App() {
	const [messages, setMessages] = React.useState(null);

	React.useEffect(()=>{
		getAllMessages();
	},[localStorage.getItem("locale")]);

	async function getAllMessages(){
		await toServer({
			method: "GET",
			url: "/system/messages",
		}).then((response)=>{
			setMessages(response.data);
		});
	};

	if(!isEmpty(messages)){
		return (
			<div className="App">
				<header className="App-header">
					<IntlProvider locale={localStorage.getItem("locale")} messages={messages[localStorage.getItem("locale")]}>
						<Routes>
							<Route path="/system" element={<StackLayout/>}>
								<Route path="label" element={<LabelSetting/>}/>
							</Route>
						</Routes>
					</IntlProvider>					
				</header>
			</div>
		);
	}
	// return (
	// 	<div className="App">
	// 		<header className="App-header">
	// 			<SampleComponent overlayId="test1"></SampleComponent>
	// 			<SampleComponent overlayId="test2"></SampleComponent>
	// 		</header>
	// 	</div>
	// );
}

export default App;
