{/* max={!this.props.maxValues?"99":this.props.maxValues.hours} */}
                max= {((!this.props.maxValues)||(this.props.values.hours < this.props.maxValues.hours))?"59":this.props.maxValues.minutes}
{((!this.props.maxValues)||(this.props.values.minutes < this.props.maxValues.minutes))?"59":this.props.maxValues.seconds}                