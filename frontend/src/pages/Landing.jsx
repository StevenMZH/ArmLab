import Card from "../components/Card";
import Grid from "../components/Grid";
import { ThemeSwitch } from "../components/ThemeSwitch";

export function Landing() {
  return (
    <>
        <Card>
            <div className="column gap5">
                <h2 className="text-main">Temple (react-spa workspace)<span></span></h2>
                <p>Use this template to set & test the app style</p>
            </div>
            <div className="row gap5">
                <ThemeSwitch className="hl1"/>
                <a href="#" className="hl2">Reload</a>
            </div>
            
        </Card>

        <div className="column full-w gap10">
            <h3 className="text-main">Card Component</h3>
            <Card>
                <div className="column gap5">
                    <p className="text-main">Card title</p>
                    <p>
                    Card Description: Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Id magni exercitationem tenetur minus mollitia, ipsa similique
                    alias veritatis illum nemo cupiditate maiores accusantium molestias
                    officia eum expedita pariatur eligendi nobis.
                    </p>
                </div>
                
                <button className="hl1">Button</button>
            </Card>
        </div>


        <div className="column full-w gap10">
            <h3 className="text-main">Text</h3>   
            <Card>
                <div>
                    <h1>H1 tag</h1>
                    <h2>H2 tag</h2>
                    <h3>H3 tag</h3>
                    <h4>H4 tag</h4>
                    <h5>H5 tag</h5>
                    <h6>H6 tag</h6>

                    <hr/>

                    <p>p tag: Lorem ipsum (<span>span tag</span>)  dolor sit amet consectetur adipisicing elit. Officia, nulla error asperiores sapiente deleniti maiores, dolores facere excepturi fugit distinctio modi debitis ut provident voluptatem adipisci aspernatur! Obcaecati, quo repellendus?</p>

                    <hr/>

                    <ul>
                        <li>ul: li item 1</li>
                        <li>ul: li item 2</li>
                    </ul>
                    <ol>
                        <li>ol: li item 1</li>
                        <li>ol: li item 2</li>
                    </ol>

                    <hr/>

                    <strong>strong tag</strong> <br />
                    <em>em tag</em> <br />
                    <blockquote cite="https://example.com"> Blockquote tag – “Quote.” </blockquote>

                    <hr/>
                    <code>        
                        console.log('Hello'); /* code tag: */
                    </code>

                </div>
            </Card>
        </div>


        <div className="column full-w gap10">
            <h3 className="text-main">Form</h3>
            <Card>
                <form className="column gap10">
                    <div className="column gap5">
                        <label>Username</label>
                        <input type="text" placeholder="text input" />    
                    </div>
                    
                    <div className="column gap5">
                        <label>Password</label> 
                        <input type="password" placeholder="password input" />
                    </div>

                    <select>
                        <option value="">Select an option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                    </select>

                    <div>
                        <input type="checkbox" id="check"/>
                        <label htmlFor="check">Checkbox</label>
                    </div>

                    <div>
                        <input type="radio" id="radio1" name="radio" />
                        <label htmlFor="radio1">Radio 1</label> <br />
                        <input type="radio" id="radio2" name="radio" />
                        <label htmlFor="radio2">Radio 2</label> <br/>
                    </div>
                
                    <textarea placeholder="Textarea" rows={3}></textarea> 

                    <button className="hl1">Submit</button>
                </form>
            </Card>
        </div>
                

            <div className="column full-w gap10">
                <h3 className="text-main">Nested Cards</h3>
                <Card>
                    <p>Text</p>
                    <Card>
                        <p>Text</p>
                        
                        <Card>
                            <p>Text</p>
                        </Card>
                        <Card>
                            <p>Text</p>
                        </Card>
                        <Card>
                            <p>Text</p>
                            <Card>
                                <p>Text</p>
                            </Card>
                        </Card>
                    </Card>
                    <Card>
                        <p>Text</p>
                    </Card>
                </Card>    
            </div>
            
            <div className="column full-w gap10">
                <h3 className="text-main">Grid</h3>
                <Grid>
                    <Card>Card 1</Card>
                    <Card>Card 2</Card>
                    <Card>Card 3</Card>
                    <Card>Card 3</Card>
                    <Card>Card 4</Card>
                    <Card>Card 5</Card>
                    <Card>Card 6</Card>
                    <Card>Card 7</Card>
                    <Card>Card 8</Card>
                </Grid>
            </div>
    
            <div className="column full-w gap10">
                <h3 className="text-main">Multimedia</h3>
                <Card>
                    <img src="default.jpg" alt="" />
                </Card>
            </div>
    </>
  );
}

export default Landing;


export function ToggleHeader({ showHeader, setShowHeader }) {
  return (
    <button onClick={() => setShowHeader(prev => !prev)}>
      {showHeader ? "Hide" : "Show"} Header
    </button>
  );
}

export function ToggleFooter({ showFooter, setShowFooter }) {
  return (
    <button onClick={() => setShowFooter(prev => !prev)}>
      {showFooter ? "Hide" : "Show"} Footer
    </button>
  );
}
