import React from "react"
import { Box, useTheme } from "@mui/material";

import { tokens } from "../../theme";
import "./clas.css"
const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    

    <div className="ibox ">
    <div className="ibox-title">
        <h5>Basic Data Tables example with responsive plugin</h5>
        <div className="ibox-tools">
            <a className="collapse-link">
                <i className="fa fa-chevron-up"></i>
            </a>
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                <i className="fa fa-wrench"></i>
            </a>
            <ul className="dropdown-menu dropdown-user">
                <li><a href="#" className="dropdown-item">Config option 1</a>
                </li>
                <li><a href="#" className="dropdown-item">Config option 2</a>
                </li>
            </ul>
            <a className="close-link">
                <i className="fa fa-times"></i>
            </a>
        </div>
    </div>
    <div className="ibox-content">

        <div className="table-responsive">
    <table className="table table-striped table-bordered table-hover dataTables-example" >
    <thead>
    <tr>
        <th>Rendering engine</th>
        <th>Browser</th>
        <th>Platform(s)</th>
        <th>Engine version</th>
        <th>CSS grade</th>
    </tr>
    </thead>
    <tbody>
    <tr className="gradeX">
        <td>Trident</td>
        <td>Internet
            Explorer 4.0
        </td>
        <td>Win 95+</td>
        <td className="center">4</td>
        <td className="center">X</td>
    </tr>
    <tr className="gradeC">
        <td>Trident</td>
        <td>Internet
            Explorer 5.0
        </td>
        <td>Win 95+</td>
        <td className="center">5</td>
        <td className="center">C</td>
    </tr>

    </tbody>
    <tfoot>
    <tr>
        <th>Rendering engine</th>
        <th>Browser</th>
        <th>Platform(s)</th>
        <th>Engine version</th>
        <th>CSS grade</th>
    </tr>
    </tfoot>
    </table>
        </div>

    </div>
</div>


  );
};

export default Geography;