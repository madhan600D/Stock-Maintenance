import React, { useEffect, useRef, useState } from 'react'
import Styles from './SearchBox.module.css'
//Components
import TextBoxWithLogo from '../TextBoxWithLogo/TextBoxWithLogo';
function SearchBox({Data  = [], OnSelection , MaxItems , OnChange  , 
                    InitialFocus = false , PlaceHolder = "Enter Something..." ,
                    Logo  , ColorPallete , DataType , SelectionCallBack , FilterType}) {
    //Component Summary:
        //1. Initial render should display only text box, On typing should display the initially loaded data, and filter em 
        //2. On clicking away from the text box should close the popup bar
        //References
        const InputBoxRef = useRef();
        const ItemsBarRef = useRef();

        //States
        const [Query , SetQuery] = useState('');
        const [IsFocused , SetIsFocused] = useState(InitialFocus);
        const [ShowItemBar , SetShowItemBar] = useState();
        const [CurrentQueryItems , SetCurrentQueryItems] = useState([]);
        const [MaxHeight , SetMaxHeight] = useState('0px');

        //Events
        useEffect(() => {
            const HandleClick = (Event) => {
                if(InputBoxRef.current && !InputBoxRef.current.contains(Event.target) || 
                    ItemsBarRef.current && !ItemsBarRef.current.contains(Event.target)){
                    SetShowItemBar(false);
                }
            }
            document.addEventListener("mousedown" , HandleClick);
            return () => document.removeEventListener("mousedown", HandleClick);
        } , [])

        useEffect(() => {
            FilterData()
            if(Query.length > 0){
                SetShowItemBar(true)
                const Height = CalculateHeight()
                SetMaxHeight(Height)
            }
            else{
                SetShowItemBar(false)
                SetMaxHeight(0)
            }
            
            
        } , [Query])

        useEffect(() => {
            const Height = CalculateHeight();
            SetMaxHeight(Height);
}, [CurrentQueryItems]);

        //Functions
        const UpdateQuery = async () => {
            SetQuery(InputBoxRef.current.value);
        }

        const HandleSelection = async () => {
            //Close the Items bar
            SetShowItemBar(false);
            SetQuery('')
            SelectionCallBack();

        }

        const CalculateHeight = () => {
            const itemHeight = 50;
            const maxVisibleItems = MaxItems || 5;
            if(CurrentQueryItems.length > 0){
                return Math.min(CurrentQueryItems.length, maxVisibleItems) * itemHeight;
            }
            else{
                return 0
            }
            
        }

        const FilterData =  () => {
            //Window filter and setQuery Items
            let FilterResult
            if(FilterType == "InitialString"){
                FilterResult = Data.filter((Value , Index) => {
                    return Value.toLowerCase().startsWith(Query.toLowerCase())
                })

            }
            else if(FilterType == "SubString"){
                FilterResult = Data.filter((Value , Index) => {
                    return Value.toLowerCase().includes(Query.toLowerCase())
                })
            }
            SetCurrentQueryItems(FilterResult)
        }
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['Input-Div']}>
            <TextBoxWithLogo 
                Logo={Logo}
                FloatingText={PlaceHolder}
                Reference={InputBoxRef}
                TBCallBack={UpdateQuery}
                Type={DataType}
                ColorPallete={ColorPallete}
            />
        </div>
  <div className={Styles['Query-Div']} style={{ maxHeight: `${ShowItemBar ? MaxHeight : 0}px`, }}>
      {CurrentQueryItems.slice(0, MaxItems).map((Value, Index) => (
        <>
            <div className={Styles['Bar-Div']} key={Index} onClick={HandleSelection}>
          <label className={Styles['Bar-Label']}>{Value}</label>
        </div>
        </>
        
      ))}
    </div>
    </div>
  )
}


export default SearchBox