import { Route, Routes } from "react-router-dom";
import LabelSetting from "./components/system/LabelSetting";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Routes>
					<Route path="/system/label" element={<LabelSetting/>}></Route>
				</Routes>
			</header>
		</div>
	);
}

export default App;
