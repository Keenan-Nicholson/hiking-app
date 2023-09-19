import geopandas as gpd
import gpxpy
import glob
from shapely.geometry import LineString
from geoalchemy2.shape import from_shape
from db import Session, Tracks, Users
import bcrypt


def ingest_gpx_from_path_to_db(dir):
    path_glob = f"{dir}*.gpx"

    gpx_files = []
    for file in glob.glob(path_glob):
        gpx_file = file
        gpx_files.append(gpx_file)

    gpx_gdfs = []
    for gpx_file in gpx_files:
        gpx = gpxpy.parse(open(gpx_file))
        data = []

        for track in gpx.tracks:
            for segment in track.segments:
                points = []

                for point in segment.points:
                    points.append((point.longitude, point.latitude))

                if len(points) > 1:
                    geometry = LineString(points)
                    geometry = geometry.simplify(0.00001)
                    name = (
                        str(track.name)
                        if track.name is not None
                        else gpx_file.split("/")[-1].split(".")[0]
                    )
                    row = {
                        "name": name,
                        "time": str(point.time),
                        "geometry": geometry,
                    }
                    data.append(row)

        gpx_gdf = gpd.GeoDataFrame(
            data, columns=["name", "time", "geometry"], crs="EPSG:4326"
        )
        gpx_gdfs.append(gpx_gdf)

    for gdf in gpx_gdfs:
        gdf["geometry"] = gdf["geometry"].apply(lambda x: from_shape(x, srid=4326))

    session = Session()

    for gdf in gpx_gdfs:
        for index, row in gdf.iterrows():
            print(row["geometry"])
            track = Tracks(name=row["name"], time=row["time"], geometry=row["geometry"])
            session.add(track)

    session.commit()


def create_user(username, password, email, first_name, last_name):
    session = Session()
    user = Users(
        username=username,
        password_hash=bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()),
        email=email,
        first_name=first_name,
        last_name=last_name,
    )
    session.add(user)
    session.commit()
